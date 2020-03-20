const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');

const multer = require('multer');
const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename : function(req, file, cb) {
        cb(null, new Date().getTime().toString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if( file.mimetype === "image/jpeg" || file.mimetype === "image/png"){ 
        cb(null, true);
        console.log("IN");
    }
    else {
        //reject the file w/o throwing any error
        // cb(null, false);
        //reject file
        cb(new Error("Only JPEG or PNG files are accepted"), false);
    }
};
const upload = multer({storage : storage,
                        limits : {
                            fileSize : 1024 * 1024 * 5
                        },
                        fileFilter : fileFilter
                    });       //passing relative path to create folder w/o root permissions


const productController = require('../controllers/products');

router.get('/', productController.products_get_all);

router.post('/', checkAuth, upload.single('productImage') , productController.products_create_product);

router.get('/:productId', productController.products_get_product);

router.patch('/:productId', checkAuth, productController.products_patch_product);

router.delete('/:productId', checkAuth, productController.products_delete_product);

module.exports = router;