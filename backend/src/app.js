const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const slopeRoutes = require('./routes/slopeRoutes');
const predictionHistoryRoutes = require('./routes/predictionHistoryRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/slopes', slopeRoutes);
app.use('/api/predictions', predictionHistoryRoutes);

app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);
app.use(errorHandler);

module.exports = app;
