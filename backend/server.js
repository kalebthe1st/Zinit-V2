// --- THIS IS THE FIX ---
// This line MUST be the very first line to execute in your entire application.
// It loads all the variables from your .env file into `process.env`.
import 'dotenv/config';

// Now that the environment variables are loaded, we can import other files.
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import reviewRouter from './routes/reviewRoute.js'; // <-- Import the new router
// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => console.log('Server started on PORT : ' + port));