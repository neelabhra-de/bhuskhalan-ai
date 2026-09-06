# bhuskhalan-ai
AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region

Run the frontend and Express backend together from the project root:

```bash
npm run dev
```

The FastAPI ML service is intentionally started separately:

```bash
cd ml-service
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

For a deployed frontend, set `VITE_API_BASE_URL` before building. The backend keeps the local development origins enabled and accepts additional comma-separated origins through `FRONTEND_URL`.
