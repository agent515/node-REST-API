const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

mongoose.connect('mongodb+srv://agent_515:'+ process.env.MONGO_ATLAS_PW +'@nodejs-rest-api-vgn72.mongodb.net/test?retryWrites=true&w=majority', {
    useMongoClient : true,
    useNewUrlParser : true,
    useUnifiedTopology : true
});

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
    extended : false,
}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
//CORS errors handeling
app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header(
        'Access-Control-Cross-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method == 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    var error = new Error('Not Found');         //Neither routes worked so give 404 error
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;