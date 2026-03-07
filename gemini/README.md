# SmartContainer Risk Engine

A full-stack AI platform for cargo risk detection and anomaly analysis.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Scikit-learn, Pandas

## Local Development Setup

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Unix/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will automatically generate ML models (`risk_model.pkl`, `anomaly_model.pkl`) if they are missing.

### 2. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

### 3. Environment Variables
Create a `.env` file in the root directory (already created locally for you):
```
VITE_API_URL=http://localhost:8000
```

## Features
- **Drag-and-Drop Upload**: Securely ingest container manifest data.
- **Neural Risk Analysis**: Real-time classification into Critical, Moderate, and Low risk tiers.
- **Anomaly Detection**: Using Isolation Forest to detect outlier shipment profiles.
- **Tactical Dashboard**: Comprehensive analytics and visualization of risk trends.
- **Explainable AI**: Model-generated summaries of risk factors.

## Deployment
- **Backend**: Ready for Render, Railway, or Fly.io. Ensure `requirements.txt` is updated.
- **Frontend**: Deployable to Vercel or Netlify. Update `VITE_API_URL` to your production backend URL.
