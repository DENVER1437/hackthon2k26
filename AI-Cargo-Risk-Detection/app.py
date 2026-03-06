import streamlit as st
import pandas as pd
import joblib

from data_preprocessing import preprocess_data

st.set_page_config(
    page_title="SmartContainer AI",
    layout="wide"
)

st.title("🚢 SmartContainer AI Risk Detection System")

st.write("Upload real-time container shipment data to detect risk levels.")

# ----------------------------
# LOAD MODELS
# ----------------------------

@st.cache_resource
def load_models():

    model = joblib.load("risk_model.pkl")
    anomaly_model = joblib.load("anomaly_model.pkl")

    return model, anomaly_model


model, anomaly_model = load_models()

# ----------------------------
# FILE UPLOAD
# ----------------------------

uploaded_file = st.file_uploader(
    "Upload Real-Time CSV",
    type=["csv"]
)

if uploaded_file is not None:

    df = pd.read_csv(uploaded_file)

    st.subheader("Uploaded Data")

    st.dataframe(df)

    # ----------------------------
    # PREPROCESS
    # ----------------------------

    df = preprocess_data(df)

    features = [
        'Declared_Value',
        'Declared_Weight',
        'Dwell_Time_Hours',
        'Weight_Gap_Pct',
        'Value_Density',
        'High_Value_Flag',
        'Long_Dwell_Flag'
    ]

    X = df[features]

    # ----------------------------
    # PREDICT
    # ----------------------------

    df["Predicted_Risk"] = model.predict(X)

    anomaly = anomaly_model.predict(X)

    df["Anomaly_Flag"] = anomaly

    df.loc[df["Anomaly_Flag"] == -1, "Anomaly_Flag"] = "Yes"
    df.loc[df["Anomaly_Flag"] == 1, "Anomaly_Flag"] = "No"

    st.subheader("Prediction Results")

    st.dataframe(df)

    # ----------------------------
    # RISK DISTRIBUTION
    # ----------------------------

    st.subheader("Risk Distribution")

    risk_counts = df["Predicted_Risk"].value_counts()

    st.bar_chart(risk_counts)

    # ----------------------------
    # DOWNLOAD RESULTS
    # ----------------------------

    csv = df.to_csv(index=False).encode('utf-8')

    st.download_button(
        "Download Results",
        csv,
        "risk_predictions.csv",
        "text/csv"
    )