const mongoose = require('mongoose');

const Order = require("../model/order");
const Product = require("../model/product");

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .populate('productId', 'name price')
    .exec()
    .then(docs => {
        res.status(200).json({
            orders : docs.map(doc => {
                        return {
                            productId : doc.productId,
                            quantity : doc.quantity,
                            _id : doc._id,
                            request : {
                                type : "GET",
                                url : "http://localhost:3000/orders/" + doc._id
                            }
                        }
                    })});
            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
}

exports.orders_create_order = (req, res, next) => {
    const order = new Order({
        _id : mongoose.Types.ObjectId(),
        productId : req.body.productId,
        quantity : req.body.quantity
    });
    const productId = req.body.productId;
    Product.findById(productId)
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message : "Product with the given productID not found",
            });
        }
        order.save()
        .then(result => {
            res.status(201).json({
                message : "Order added successfully",
                productId : result.productId,
                quantity : result.quantity,
                request : {
                    type : "GET",
                    url : "http://localhost:3000/orders/" + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
            next(err);
        });
        
    })
    .catch(err => {
        res.status(500).json({
            error : err,
            message : "Product.find() catch triggered"
        })
        next(err);
    });
}

exports.orders_get_order = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .populate('productId', 'name price')
    .exec()
    .then(order => {
        if(!order) {
            return res.status(404).json({
                message : "Order with the given ID not found"
            });
        }
        res.status(200).json({
            message : "Order details",
            productId : order.productId,
            quantity : order.quantity,
            orderId : order._id,
            request : {
                type : "GET",
                description: "get all the orders",
                url : "http://localhost:3000/orders"
            }
        })

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.orders_delete_order = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.remove({_id : orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message : "Order was deleted",
            result : result
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}