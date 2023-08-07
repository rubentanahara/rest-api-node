// Import required modules
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';

import router from './router';

// Constants
const PORT = 8080;
const MONGO_URL =
  'mongodb+srv://tanaharaguy:anONHzNZwTE6lTwl@cluster0.h3krndw.mongodb.net/?retryWrites=true&w=majority';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ Connected to the database!');
  })
  .catch((error) => {
    console.error('🔴 Connection error:', error.message);
  });

// Start the server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}/`);
});

app.use('/', router());