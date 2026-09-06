# 🧠 Bhuskhalan AI — ML Service

The Machine Learning engine powering **Bhuskhalan AI's landslide risk prediction system**.

## ⚡ What it does

- Processes **19 environmental and terrain parameters**
- Uses an **XGBoost Classifier** for landslide risk prediction
- Generates:
  - 🎯 Prediction
  - 📊 Risk Probability
  - 📈 Risk Score
  - 🚨 Risk Level

## 🚦 Risk Levels

| Score | Level |
|------:|-------|
| 0–24 | 🟢 LOW |
| 25–49 | 🟡 MODERATE |
| 50–74 | 🟠 HIGH |
| 75–100 | 🔴 CRITICAL |

## 🏗️ Tech Stack

**Python • FastAPI • XGBoost • Pandas • Scikit-learn**

## 🚀 Run Locally

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

For Render, use `ml-service` as the service root directory, `pip install -r requirements.txt` as the build command, and:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

The model is loaded from a path relative to `main.py`, so the checked-in model file remains available in deployment.


API Docs:

http://127.0.0.1:8000/docs


📁 Key Files
main.py                         → FastAPI prediction service
bhuskhalan_xgboost_model.json   → Trained XGBoost model
train_model.py                  → Model training script
requirements.txt                → Dependencies

Built for the Bhuskhalan AI — Landslide Risk Monitoring & Early Warning System 🌄🚨
