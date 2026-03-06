import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    f1_score,
    recall_score,
    classification_report,
    confusion_matrix
)

from data_preprocessing import preprocess_data

print("📂 Loading Historical Data...")

df = pd.read_csv('Historical Data.csv')

df = preprocess_data(df)

# ----------------------------
# CREATE RISK LABEL
# ----------------------------

def risk_mapper(x):

    x = str(x).lower()

    if x == "clear":
        return "Low"

    elif x in ["flagged", "inspection", "hold"]:
        return "Medium"

    else:
        return "Critical"

df['Risk_Level'] = df['Clearance_Status'].apply(risk_mapper)

# ----------------------------
# FEATURES
# ----------------------------

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

# ----------------------------
# ADD SMALL NOISE
# ----------------------------

noise_factor = 0.05

X['Weight_Gap_Pct'] += np.random.normal(0, noise_factor, X.shape[0])
X['Value_Density'] += np.random.normal(0, noise_factor, X.shape[0])

# ----------------------------
# TRAIN TEST SPLIT
# ----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    stratify=y,
    random_state=42
)

# ----------------------------
# TRAIN MODEL
# ----------------------------

print("🧠 Training RandomForest model...")

model = RandomForestClassifier(

    n_estimators=200,
    max_depth=6,
    min_samples_leaf=50,

    class_weight={
        "Low":1,
        "Medium":2,
        "Critical":4
    },

    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# ----------------------------
# PREDICTIONS
# ----------------------------

y_pred = model.predict(X_test)

# ----------------------------
# METRICS
# ----------------------------

acc = accuracy_score(y_test, y_pred)
macro_f1 = f1_score(y_test, y_pred, average='macro')
weighted_f1 = f1_score(y_test, y_pred, average='weighted')

recall_critical = recall_score(
    y_test,
    y_pred,
    labels=['Critical'],
    average=None
)

print("\n==============================")
print("PRIMARY METRIC")
print(f"Accuracy: {acc:.2%}")
print(f"Macro F1 : {macro_f1:.4f}")

print("\nSECONDARY METRICS")
print(f"Weighted F1 : {weighted_f1:.4f}")
print(f"Recall Critical : {recall_critical[0]:.4f}")

print("\nClassification Report\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix\n")
print(confusion_matrix(y_test, y_pred))

# ----------------------------
# SAVE MODEL
# ----------------------------

joblib.dump(model, 'risk_model.pkl')

print("\n✅ risk_model.pkl saved successfully!")