const mongoose = require('mongoose');

const Product = require('../model/product.js');

exports.products_get_all = (req, res, next) => {
    Product.find()
    .select('_id name price productImage')
    .exec().
    then(docs => {
        const response = {
            count : docs.length,
            products: docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price,
                    productImage : doc.productImage,
                    _id : doc._id,
                    request : {
                        type : "GET",
                        url : "http://localhost:3000/products/" + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    }).
    catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });
    product.save()
    .then(result => {
        res.status(201).json({
            message : "Product added successfully",
            product : {
                name : result.name,
                price : result.price,
                productImage : result.productImage,
                _id : result._id
            },
            request : {
                type : "GET",
                url : "http://localhost:3000/products/" + result._id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
        // next(err);
    });
}

exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                name : doc.name,
                price : doc.price,
                productImage : doc.productImage,
                _id : doc._id,
                request : {
                    type : "GET",
                    description : "get all the products",
                    url : "http://localhost:3000/products"
                }
            });
        }
        else {
            res.status(404).json({
                message : "No entry found for the provided ID"
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    }
    );
}

exports.products_patch_product = (req, res, next) => {
    const id = req.params.productId;
    var updateOps = {};
    for(const [key, value] of Object.entries(req.body)) {
        updateOps[key] = value;
    }
    Product.update({_id : id}, { $set : updateOps })
    .exec()
    .then(result => {

        res.status(200).json({
            message : "Updated product",
            product : {
                name : result.name,
                price : result.price,
                productImage : result.productImage,
                _id : result._id
            },
            request : {
                type : "GET",
                url : "http://localhost:3000/products" + result._id
            }
        });
    })
    .catch(err => {

        res.status(500).json({
            error : err,
            id : id
        })
    });
    console.log(req.body);
}

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message : "Deleted product",
            request : {
                type : "POST",
                url : "http://localhost:3000/products",
                body : {
                    name : "String",
                    price : "Number"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
    
}