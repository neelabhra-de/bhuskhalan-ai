from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "wsn_landslide_data (1).csv"
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
TARGET = "Label"


def main() -> None:
    df = pd.read_csv(DATASET_PATH)
    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    model = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=42,
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_probability = model.predict_proba(X_test)[:, 1]

    print(f"Dataset rows used: {len(df)}")
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    print(f"Input feature count: {len(FEATURES)}")
    print(f"Test accuracy: {accuracy_score(y_test, y_pred):.6f}")
    print("Classification report:")
    print(classification_report(y_test, y_pred))
    print("Confusion matrix:")
    print(confusion_matrix(y_test, y_pred))
    print(f"ROC AUC: {roc_auc_score(y_test, y_probability):.6f}")

    model.save_model(MODEL_PATH)
    print(f"JSON model saved successfully: {MODEL_PATH}")


if __name__ == "__main__":
    main()
