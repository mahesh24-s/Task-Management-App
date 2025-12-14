const express = require('express');
const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
app.use(cors({
    origin:'*'
}));


require('dotenv').config()

const mongoose = require('mongoose');
const connectDB = require('./config/database');
connectDB();

// check to which database our mongodb has connected and also chks cluster
// mongoose.connection.on('connected', () => {
//   console.log('Connected to cluster:', mongoose.connection.host);
//   console.log('Database:', mongoose.connection.name);
// });

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use("/",userRoutes,adminRoutes);

const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    return res.json({
        success: true,
        message: "Server is running good, Welcome to the backend API of our course management system",
    })
})

app.get('/test', (req,res) => {
    return res.json({
        success:true,
        data: "welcome to the test route"
    })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
