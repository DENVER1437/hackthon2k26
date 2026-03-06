import streamlit as st
import pandas as pd
import joblib
import os
import plotly.express as px

from data_preprocessing import preprocess_data


# -----------------------------
# PAGE SETTINGS
# -----------------------------

st.set_page_config(
    page_title="SmartContainer AI",
    page_icon="🚢",
    layout="wide"
)

st.title("🚢 SmartContainer AI Risk Detection System")
st.markdown("### AI-powered container risk analysis dashboard")

st.divider()


# -----------------------------
# MODEL ACCURACY (CHANGE IF NEEDED)
# -----------------------------

MODEL_ACCURACY = 0.87


# -----------------------------
# LOAD MODELS SAFELY
# -----------------------------

@st.cache_resource
def load_models():

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    model_path = os.path.join(BASE_DIR, "risk_model.pkl")
    anomaly_path = os.path.join(BASE_DIR, "anomaly_model.pkl")

    if not os.path.exists(model_path):
        st.error("❌ risk_model.pkl not found in repository.")
        st.stop()

    if not os.path.exists(anomaly_path):
        st.error("❌ anomaly_model.pkl not found in repository.")
        st.stop()

    model = joblib.load(model_path)
    anomaly_model = joblib.load(anomaly_path)

    return model, anomaly_model


model, anomaly_model = load_models()


# -----------------------------
# FILE UPLOAD
# -----------------------------

st.sidebar.header("📂 Upload Shipment Data")

uploaded_file = st.sidebar.file_uploader(
    "Upload Real-Time CSV",
    type=["csv"]
)

if uploaded_file is None:
    st.info("Upload a dataset from the sidebar to start risk detection.")
    st.stop()


# -----------------------------
# LOAD DATA
# -----------------------------

df = pd.read_csv(uploaded_file)

st.subheader("📂 Uploaded Dataset")

st.dataframe(df, use_container_width=True)


# -----------------------------
# PREPROCESS DATA
# -----------------------------

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


# -----------------------------
# PREDICTIONS
# -----------------------------

df["Predicted_Risk"] = model.predict(X)

anomaly = anomaly_model.predict(X)

df["Anomaly_Flag"] = anomaly
df.loc[df["Anomaly_Flag"] == -1, "Anomaly_Flag"] = "Yes"
df.loc[df["Anomaly_Flag"] == 1, "Anomaly_Flag"] = "No"


# -----------------------------
# METRICS
# -----------------------------

total = len(df)
low = (df["Predicted_Risk"] == "Low").sum()
medium = (df["Predicted_Risk"] == "Medium").sum()
critical = (df["Predicted_Risk"] == "Critical").sum()
anomaly_count = (df["Anomaly_Flag"] == "Yes").sum()

st.subheader("📊 Risk Overview")

col1, col2, col3, col4, col5, col6 = st.columns(6)

col1.metric("📦 Total Containers", total)
col2.metric("🟢 Low Risk", low)
col3.metric("🟡 Medium Risk", medium)
col4.metric("🔴 Critical Risk", critical)
col5.metric("🚨 Anomalies", anomaly_count)
col6.metric("🎯 Model Accuracy", f"{MODEL_ACCURACY*100:.2f}%")


# -----------------------------
# RISK DISTRIBUTION BAR CHART
# -----------------------------

st.subheader("📈 Risk Distribution")

risk_counts = df["Predicted_Risk"].value_counts().reset_index()
risk_counts.columns = ["Risk_Level", "Count"]

fig = px.bar(
    risk_counts,
    x="Risk_Level",
    y="Count",
    color="Risk_Level",
    text="Count",
    color_discrete_map={
        "Low": "#2ecc71",
        "Medium": "#f1c40f",
        "Critical": "#e74c3c"
    }
)

fig.update_traces(textposition="outside")

fig.update_layout(
    template="plotly_dark",
    height=450,
    showlegend=False
)

st.plotly_chart(fig, use_container_width=True)


# -----------------------------
# RISK PERCENTAGE DONUT
# -----------------------------

st.subheader("📊 Risk Percentage")

percent_df = risk_counts.copy()
percent_df["Percent"] = (percent_df["Count"] / percent_df["Count"].sum()) * 100

fig2 = px.pie(
    percent_df,
    names="Risk_Level",
    values="Percent",
    hole=0.5,
    color="Risk_Level",
    color_discrete_map={
        "Low": "#2ecc71",
        "Medium": "#f1c40f",
        "Critical": "#e74c3c"
    }
)

fig2.update_layout(template="plotly_dark")

st.plotly_chart(fig2, use_container_width=True)


# -----------------------------
# ALERTS
# -----------------------------

if anomaly_count > 0:
    st.warning(f"⚠ {anomaly_count} suspicious containers detected!")


# -----------------------------
# RESULTS TABLE
# -----------------------------

st.subheader("📋 Prediction Results")

st.dataframe(df, use_container_width=True)


# -----------------------------
# DOWNLOAD RESULTS
# -----------------------------

csv = df.to_csv(index=False).encode("utf-8")

st.download_button(
    "⬇ Download Predictions",
    csv,
    "risk_predictions.csv",
    "text/csv"
)
