const express = require("express");
const app = express();
const User = require("./modules/User");
const mongoose = require("mongoose");
const authRoutes = require('./routes/user');
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//cores headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Controll-Allow-Headers', '*');
    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// Routes which should handle requests
app.use('/user', authRoutes);
//app.use('/auth/search', search)
app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        err: {
            message: err.message
        }
    });
});

const uri = "mongodb+srv://social_network:ipEFdWLr8Bf9WnO2@cluster0.vpwwxax.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(uri, { useUnifiedTopology: true ,})
.then(()=>{
    app.listen(3001,()=>{console.log('Server running on port 3001');});
});

module.exports = app;