import express from 'express';
import mongoose from 'mongoose';

import teachersRoute from './routes/teachers.route.js';
import teacherPositionsRoute from './routes/teacherPositions.route.js';

const app = express();
app.use(express.json());

// Allow requests from the frontend dev server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Connect to MongoDB with mongoose
// NOTE: dùng connection string dạng mongodb:// thay vì mongodb+srv://
// vì Node.js trên máy này không phân giải được bản ghi SRV của MongoDB Atlas
// (lỗi: querySrv ECONNREFUSED).
const uri = "mongodb://dbUser:123123123@ac-hxe3bp6-shard-00-00.rhsmiup.mongodb.net:27017,ac-hxe3bp6-shard-00-01.rhsmiup.mongodb.net:27017,ac-hxe3bp6-shard-00-02.rhsmiup.mongodb.net:27017/WEB98-FinalTest?ssl=true&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB with mongoose'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/teachers', teachersRoute);
app.use('/teacher-positions', teacherPositionsRoute);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
