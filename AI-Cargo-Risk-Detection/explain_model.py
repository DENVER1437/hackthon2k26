import pandas as pd
import matplotlib.pyplot as plt
import joblib

model = joblib.load('risk_model.pkl')

feature_names = [
    'Declared_Value',
    'Declared_Weight',
    'Dwell_Time_Hours',
    'Weight_Gap_Pct',
    'Value_Density',
    'High_Value_Flag',
    'Long_Dwell_Flag'
]

importances = model.feature_importances_

importance_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': importances
})

importance_df = importance_df.sort_values(by='Importance')

plt.figure(figsize=(10,6))

plt.barh(
    importance_df['Feature'],
    importance_df['Importance']
)

plt.xlabel("Feature Importance")
plt.title("AI Risk Detection Reasoning")

plt.grid(axis='x', linestyle='--', alpha=0.7)

plt.tight_layout()

plt.savefig("ai_reasoning_chart.png")

plt.show()

print("✅ Chart saved: ai_reasoning_chart.png")