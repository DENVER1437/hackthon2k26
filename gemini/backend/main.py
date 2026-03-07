from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import pandas as pd
import numpy as np
import io
import subprocess
import sys

app = FastAPI(title="SmartContainer Risk Engine API")

# Setup CORS to allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def ensure_models_exist():
    """Checks if models exist, if not, runs generation script."""
    RISK_MODEL_PATH = os.path.join(os.path.dirname(__file__), "risk_model.pkl")
    ANOMALY_MODEL_PATH = os.path.join(os.path.dirname(__file__), "anomaly_model.pkl")
    
    if not os.path.exists(RISK_MODEL_PATH) or not os.path.exists(ANOMALY_MODEL_PATH):
        print("🔍 Models missing. Triggering auto-generation...")
        gen_script = os.path.join(os.path.dirname(__file__), "generate_models.py")
        try:
            subprocess.run([sys.executable, gen_script], check=True)
            print("✅ Models generated successfully.")
        except Exception as e:
            print(f"❌ Failed to generate models: {e}")
            return False, None, None
            
    try:
        print("Loading ML Models...")
        rm = joblib.load(RISK_MODEL_PATH)
        am = joblib.load(ANOMALY_MODEL_PATH)
        print("✅ Models loaded successfully")
        return True, rm, am
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        return False, None, None

models_loaded, risk_model, anomaly_model = ensure_models_exist()

# ----------------------------
# DATA MODELS
# ----------------------------

class ContainerData(BaseModel):
    Container_ID: str
    Declaration_Date: str = "2023-01-01"
    Declaration_Time: str = "12:00"
    Trade_Regime: str = "Import"
    Origin_Country: str = "Unknown"
    Destination_Country: str = "Unknown"
    Destination_Port: str = "Unknown"
    HS_Code: str = "000000"
    Importer_ID: str = "Unknown"
    Exporter_ID: str = "Unknown"
    Declared_Value: float = 0.0
    Declared_Weight: float = 0.0
    Measured_Weight: float = 0.0
    Shipping_Line: str = "Unknown"
    Dwell_Time_Hours: float = 0.0
    Clearance_Status: str = "Unknown"

# ----------------------------
# CORE LOGIC
# ----------------------------

def calculate_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    """Replicates the user's feature engineering logic"""
    df_feat = pd.DataFrame()
    
    # Ensure numerics
    dec_val = pd.to_numeric(df['Declared_Value'], errors='coerce').fillna(0)
    dec_wt = pd.to_numeric(df['Declared_Weight'], errors='coerce').fillna(0)
    meas_wt = pd.to_numeric(df['Measured_Weight'], errors='coerce').fillna(0)
    dwell = pd.to_numeric(df['Dwell_Time_Hours'], errors='coerce').fillna(0)
    
    # 7 Exact Features needed by the Pipeline
    df_feat['Declared_Value'] = dec_val
    df_feat['Declared_Weight'] = dec_wt
    df_feat['Dwell_Time_Hours'] = dwell
    df_feat['Weight_Gap_Pct'] = abs(meas_wt - dec_wt) / (dec_wt + 1)
    df_feat['Value_Density'] = dec_val / (dec_wt + 1)
    df_feat['High_Value_Flag'] = (dec_val > 50000).astype(int)
    df_feat['Long_Dwell_Flag'] = (dwell > 48).astype(int)
    
    return df_feat

def generate_explanation(row, risk_level, anomaly_score):
    """Generates the mandatory 1-2 line explanation"""
    reasons = []
    
    if risk_level == "Critical":
        if row['Weight_Gap_Pct'] > 0.2:
            reasons.append(f"Massive weight discrepancy of {row['Weight_Gap_Pct']*100:.0f}%.")
        if anomaly_score == -1:
            reasons.append("Flagged by Isolation Forest for anomalous profile.")
        if row['Dwell_Time_Hours'] > 72:
            reasons.append("Extremely suspicious dwell time.")
            
        if not reasons:
            reasons.append("Model detected high-risk multivariate pattern.")
            
    elif risk_level == "Medium":
        if row['Weight_Gap_Pct'] > 0.1:
            reasons.append("Moderate weight discrepancy observed.")
        elif row['Long_Dwell_Flag'] == 1:
            reasons.append("Dwell time exceeds normal 48-hour threshold.")
        else:
            reasons.append("Minor irregularities matching historical flagged patterns.")
            
    else:
        reasons.append("Shipment profile matches standard low-risk traffic.")
        
    return " ".join(reasons)

def process_predictions(df: pd.DataFrame) -> pd.DataFrame:
    """Runs the models and returns the required output format"""
    if df.empty:
        return df
        
    # Extract features
    X = calculate_derived_features(df)
    
    # Run Predictions
    # Instead of raw `.predict()` which favors the majority class (Low Risk), 
    # we manually adjust thresholds using `.predict_proba()` for realistic distribution.
    probas = risk_model.predict_proba(X)
    classes = list(risk_model.classes_)
    
    crit_idx = classes.index("Critical") if "Critical" in classes else -1
    med_idx = classes.index("Medium") if "Medium" in classes else -1
    low_idx = classes.index("Low") if "Low" in classes else -1
    
    risk_preds = []
    scores = []
    
    for p in probas:
        crit_prob = p[crit_idx] if crit_idx != -1 else 0
        med_prob = p[med_idx] if med_idx != -1 else 0
        
        # Calculate a proxy "Risk Score" (0-100)
        # We increase the weight of the Critical probability to be more sensitive
        score = (crit_prob * 110) + (med_prob * 45)
        final_score = min(100, max(0, round(score)))
        scores.append(final_score)
        
        # Recalibrated Thresholds to match user's expected ~5% Critical and ~32% Moderate targets
        if crit_prob > 0.12 or final_score > 65:  
            risk_preds.append("Critical")
        elif med_prob > 0.18 or final_score > 30: 
            risk_preds.append("Medium")
        else:
            risk_preds.append("Low")
            
    risk_preds = np.array(risk_preds)
            
    # Run Anomaly Detection
    # Increased contamination to ~5% to match heavier risk profiles
    if len(X) > 50:
        from sklearn.ensemble import IsolationForest
        dynamic_anomaly_model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
        anomaly_preds = dynamic_anomaly_model.fit_predict(X)
    else:
        anomaly_preds = anomaly_model.predict(X)
    
    # Build output dataframe
    results = pd.DataFrame({
        'Container_ID': df.get('Container_ID', 'UNKNOWN_' + pd.Series(range(len(df))).astype(str)),
        'Risk_Score': scores,
        'Risk_Level': risk_preds,
        'Anomaly_Flag': ["Yes" if a == -1 else "No" for a in anomaly_preds],
        'Origin_Country': df.get('Origin_Country', 'Global'),
        'Declared_Value': df.get('Declared_Value', 0.0),
        'Declaration_Date': df.get('Declaration_Date', '2024-03-06'),
        'Declaration_Time': df.get('Declaration_Time', '12:00'),
        'Declared_Weight': df.get('Declared_Weight', 0.0),
        'Measured_Weight': df.get('Measured_Weight', 0.0),
        'Dwell_Time_Hours': df.get('Dwell_Time_Hours', 0.0)
    })
    
    # Add Explanations
    explanations = []
    for i in range(len(df)):
        exp = generate_explanation(X.iloc[i], risk_preds[i], anomaly_preds[i])
        explanations.append(exp)
        
    results['Explanation_Summary'] = explanations
    return results

# ----------------------------
# ENDPOINTS
# ----------------------------

@app.get("/health")
def health_check():
    return {"status": "ok", "models_loaded": models_loaded}

@app.post("/predict")
def predict_single(data: ContainerData):
    if not models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
        
    df = pd.DataFrame([data.dict()])
    result_df = process_predictions(df)
    
    return result_df.to_dict(orient="records")[0]

@app.post("/predict_batch")
async def predict_batch(file: UploadFile = File(...)):
    if not models_loaded:
        raise HTTPException(status_code=503, detail="Models not loaded")
        
    if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
        
    try:
        # Read the file
        contents = await file.read()
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
            
        if df.empty:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # Validate required columns if any (optional, but good for demo resilience)
        required_cols = ['Declared_Value', 'Declared_Weight', 'Measured_Weight', 'Dwell_Time_Hours']
        missing = [col for col in required_cols if col not in df.columns]
        if missing:
            # For hackathon demo, we might want to be lenient and add dummy data if missing
            # but for "production-ready" we should at least log it.
            print(f"Warning: Missing expected columns: {missing}")

        print(f"Processing batch of {len(df)} containers...")
        
        # Process
        result_df = process_predictions(df)
        
        # Format output as requested
        # Output classes: Critical Risk, Low Risk, Anomaly (mapped from Risk_Level and Anomaly_Flag)
        formatted_results = []
        for i, row in result_df.iterrows():
            prediction = row['Risk_Level']
            if row['Anomaly_Flag'] == 'Yes':
                prediction = "Anomaly"
            
            # Label mapping for UI
            label_map = {
                "Critical": "Critical Risk",
                "Medium": "Moderate Risk", # Mapping Medium to Moderate for UI
                "Low": "Low Risk",
                "Anomaly": "Anomaly"
            }
            
            # Risk_Score is 0-100, confidence should be 0-1
            confidence = round(row['Risk_Score'] / 100, 2)
            
            formatted_results.append({
                "row": i + 1,
                "container_id": row['Container_ID'], # Added for frontend table
                "prediction": label_map.get(prediction, prediction),
                "confidence": confidence,
                "details": row.to_dict() # Keep original data for the dashboard/table
            })
            
        return {"results": formatted_results}
        
    except Exception as e:
        print(f"Error processing upload: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
