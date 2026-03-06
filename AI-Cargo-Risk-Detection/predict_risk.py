import pandas as pd
import joblib
from data_preprocessing import preprocess_data

print("📂 Loading Real-Time Data...")

df = pd.read_csv('Real-Time Data.csv')

df = preprocess_data(df)

model = joblib.load('risk_model.pkl')
anomaly_model = joblib.load('anomaly_model.pkl')

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
# PREDICT RISK
# ----------------------------

df['Predicted_Risk'] = model.predict(X)

# ----------------------------
# ANOMALY DETECTION
# ----------------------------

anomaly = anomaly_model.predict(X)

df['Anomaly_Flag'] = anomaly

df.loc[df['Anomaly_Flag'] == -1, 'Anomaly_Flag'] = "Yes"
df.loc[df['Anomaly_Flag'] == 1, 'Anomaly_Flag'] = "No"

print(df[['Container_ID','Predicted_Risk','Anomaly_Flag']])

df.to_csv("prediction_output.csv", index=False)

print("📦 Predictions saved to prediction_output.csv")