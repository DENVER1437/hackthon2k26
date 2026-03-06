import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import IsolationForest
from data_preprocessing import preprocess_data

print("📂 Loading Historical Data...")

df = pd.read_csv('Historical Data.csv')

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

X = df[features].copy()

noise_factor = 0.05

X['Weight_Gap_Pct'] += np.random.normal(0, noise_factor, X.shape[0])
X['Value_Density'] += np.random.normal(0, noise_factor, X.shape[0])

print("🕵️ Training anomaly detection model...")

anomaly_model = IsolationForest(

    n_estimators=200,
    contamination=0.02,
    random_state=42,
    n_jobs=-1
)

anomaly_model.fit(X)

joblib.dump(anomaly_model, 'anomaly_model.pkl')

print("✅ anomaly_model.pkl saved!")