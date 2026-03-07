import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, IsolationForest

print("Generating synthetic data since original CSV is not available...")

# Generate 5000 rows of synthetic data that matches the required distributions
np.random.seed(42)
n_samples = 5000

# 1. Base Variables
declared_value = np.random.exponential(scale=40000, size=n_samples)
declared_weight = np.random.normal(loc=15000, scale=3000, size=n_samples).clip(min=1000)
dwell_time = np.random.exponential(scale=24, size=n_samples).clip(min=1)

# 2. Add realistic variance for Measured Weight
measured_weight = declared_weight * np.random.normal(loc=1.0, scale=0.05, size=n_samples)

# Insert strong anomalies for the model to learn (Critical Risk)
n_critical = 300
critical_idx = np.random.choice(n_samples, n_critical, replace=False)
measured_weight[critical_idx] = declared_weight[critical_idx] * np.random.uniform(1.3, 2.0, size=n_critical) # Huge weight difference
dwell_time[critical_idx] = np.random.uniform(72, 300, size=n_critical)

# Insert medium anomalies (Medium Risk)
n_med = 700
remaining_idx = list(set(range(n_samples)) - set(critical_idx))
med_idx = np.random.choice(remaining_idx, n_med, replace=False)
measured_weight[med_idx] = declared_weight[med_idx] * np.random.uniform(1.1, 1.25, size=n_med)
dwell_time[med_idx] = np.random.uniform(48, 96, size=n_med)

# Feature Engineering
weight_gap_pct = abs(measured_weight - declared_weight) / (declared_weight + 1)
value_density = declared_value / (declared_weight + 1)
high_value_flag = (declared_value > 50000).astype(int)
long_dwell_flag = (dwell_time > 48).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'Declared_Value': declared_value,
    'Declared_Weight': declared_weight,
    'Dwell_Time_Hours': dwell_time,
    'Weight_Gap_Pct': weight_gap_pct,
    'Value_Density': value_density,
    'High_Value_Flag': high_value_flag,
    'Long_Dwell_Flag': long_dwell_flag
})

# Add Target Labels
risk_level = np.array(['Low'] * n_samples, dtype=object)
risk_level[med_idx] = 'Medium'
risk_level[critical_idx] = 'Critical'
df['Risk_Level'] = risk_level

# The exact 7 features the user script requested
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
y = df['Risk_Level']

# Add user's specific noise layer for robustness before training
noise_factor = 0.05
X['Weight_Gap_Pct'] += np.random.normal(0, noise_factor, X.shape[0])
X['Value_Density'] += np.random.normal(0, noise_factor, X.shape[0])

# TRAIN REGULAR MODEL (copying user's exact params)
print("🧠 Training RandomForest model...")
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=6,
    min_samples_leaf=50,
    class_weight={"Low": 1, "Medium": 2, "Critical": 4},
    random_state=42,
    n_jobs=-1
)
rf_model.fit(X, y)
joblib.dump(rf_model, 'backend/risk_model.pkl')
print("✅ risk_model.pkl saved successfully!")

# TRAIN ANOMALY MODEL (copying user's exact params)
print("🕵️ Training anomaly detection model...")
anomaly_model = IsolationForest(
    n_estimators=200,
    contamination=0.02,
    random_state=42,
    n_jobs=-1
)
anomaly_model.fit(X)
joblib.dump(anomaly_model, 'backend/anomaly_model.pkl')
print("✅ anomaly_model.pkl saved!")
