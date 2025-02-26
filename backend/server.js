import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();

// Middleware
app.use(express.json());

// Routes


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