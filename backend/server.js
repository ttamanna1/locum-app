import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import router from './routes/allRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', router);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
async function startServer() {
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Database connections established')
    app.listen(process.env.PORT, () => console.log(`👂 Server listening on port ${process.env.PORT}`))
  } catch (error) {
    console.log('❌ Error establishing connection')
    console.log(error)
  }
}

startServer();