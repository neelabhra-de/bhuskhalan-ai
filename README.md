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

## Deployment preparation

Deploy the services independently.

### FastAPI ML service on Render

Use `ml-service` as the service root directory:

```text
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Express backend on Render

Use `backend` as the service root directory:

```text
Build Command: npm install
Start Command: npm start
```

Backend environment variables:

```ini
PORT=10000
MONGO_URI=<MongoDB Atlas connection string>
ML_SERVICE_URL=https://<your-ml-service>.onrender.com
FRONTEND_URL=https://<your-frontend>.vercel.app
```

### React frontend on Vercel

Use `frontend` as the project root directory:

```text
Build Command: npm run build
Output Directory: dist
```

Frontend environment variable:

```ini
VITE_API_BASE_URL=https://<your-backend>.onrender.com/api
```

Do not commit real credentials. The local frontend fallback remains `http://localhost:5000/api` when `VITE_API_BASE_URL` is not set.
