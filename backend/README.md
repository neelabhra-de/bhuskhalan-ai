

# Bhuskhalan AI Backend

Minimal Express API layer between the React frontend and the FastAPI/XGBoost ML service. It validates prediction input, forwards it to the ML service, and returns the prediction to the frontend. Database integration is intentionally not included.

## Structure

- `server.js` - starts the HTTP server
- `src/app.js` - Express setup, CORS, routes, and error handling
- `src/config/env.js` - environment configuration
- `src/controllers/` - request handling and validation
- `src/services/mlService.js` - Axios integration with the ML service
- `src/routes/` - health and prediction routes
- `src/middleware/errorHandler.js` - centralized error responses

## Installation and configuration

```bash
npm install
```

Copy `.env.example` to `.env` for local development (do not commit `.env`):

```ini
PORT=5000
ML_SERVICE_URL=http://127.0.0.1:8000
```

## Run

```bash
npm run dev
```

For production-style startup: `npm start`

## API endpoints

- `GET /api/health` - backend health check
- `POST /api/predict` - validates and forwards the 19 model features

Example prediction request (PowerShell):

```powershell
$body = @{ Rainfall_mm=120; Rainfall_3Day=250; Rainfall_7Day=480; Slope_Angle=34.5; Elevation_m=1250; Soil_Saturation=0.78; Historical_Landslide_Count=2; Pore_Water_Pressure_kPa=42; Soil_Moisture_Content=0.64; Microseismic_Activity=0.12; Acoustic_Emission_dB=68; Soil_Strain=0.004; Soil_Erosion_Rate=1.8; NDVI_Index=0.52; Vegetation_Cover=0.61; Distance_to_Road_m=350; Proximity_to_Water=0.35; Earthquake_Activity=0.08; TDR_Reflection_Index=0.73 } | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/predict -Method Post -ContentType 'application/json' -Body $body
```

Successful predictions return `{ "success": true, "data": <ML response> }`. Invalid or missing fields return HTTP 400, an unavailable ML service returns HTTP 503, and unexpected server errors return HTTP 500 without stack traces.
