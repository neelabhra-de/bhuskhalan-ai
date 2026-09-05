from pathlib import Path
from typing import Optional

import pandas as pd
import xgboost as xgb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "bhuskhalan_xgboost_model.json"

FEATURES = [
    "Rainfall_mm",
    "Rainfall_3Day",
    "Rainfall_7Day",
    "Slope_Angle",
    "Elevation_m",
    "Soil_Saturation",
    "Historical_Landslide_Count",
    "Pore_Water_Pressure_kPa",
    "Soil_Moisture_Content",
    "Microseismic_Activity",
    "Acoustic_Emission_dB",
    "Soil_Strain",
    "Soil_Erosion_Rate",
    "NDVI_Index",
    "Vegetation_Cover",
    "Distance_to_Road_m",
    "Proximity_to_Water",
    "Earthquake_Activity",
    "TDR_Reflection_Index",
]

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]


class PredictionRequest(BaseModel):
    Rainfall_mm: float
    Rainfall_3Day: float
    Rainfall_7Day: float
    Slope_Angle: float
    Elevation_m: float
    Soil_Saturation: float
    Historical_Landslide_Count: float
    Pore_Water_Pressure_kPa: float
    Soil_Moisture_Content: float
    Microseismic_Activity: float
    Acoustic_Emission_dB: float
    Soil_Strain: float
    Soil_Erosion_Rate: float
    NDVI_Index: float
    Vegetation_Cover: float
    Distance_to_Road_m: float
    Proximity_to_Water: float
    Earthquake_Activity: float
    TDR_Reflection_Index: float


app = FastAPI(title="Bhuskhalan AI ML Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model: Optional[xgb.XGBClassifier] = None
model_load_error: Optional[str] = None

try:
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
except Exception as exc:
    model = None
    model_load_error = str(exc)


def risk_level_from_score(risk_score: float) -> str:
    if risk_score < 25:
        return "LOW"
    if risk_score < 50:
        return "MODERATE"
    if risk_score < 75:
        return "HIGH"
    return "CRITICAL"


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Bhuskhalan AI ML Service Running"}


@app.get("/health")
def health() -> dict[str, object]:
    if model is None:
        return {"status": "unhealthy", "model_loaded": False}
    return {"status": "healthy", "model_loaded": True}


@app.post("/predict")
def predict(request: PredictionRequest) -> dict[str, object]:
    if model is None:
        detail = "Model is not loaded."
        if model_load_error:
            detail += f" Load error: {model_load_error}"
        raise HTTPException(status_code=503, detail=detail)

    try:
        input_df = pd.DataFrame([[getattr(request, feature) for feature in FEATURES]], columns=FEATURES)
        probability = float(model.predict_proba(input_df)[0][1])
        prediction = int(model.predict(input_df)[0])
        risk_score = float(probability * 100)
        return {
            "prediction": prediction,
            "risk_probability": probability,
            "risk_score": risk_score,
            "risk_level": risk_level_from_score(risk_score),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc
