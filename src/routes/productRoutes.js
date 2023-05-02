const express = require('express');
const multer = require("multer");
var path = require('path')

const productController = require('./../controllers/productController');

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {

//     cb(null, path.join(__dirname, "./../../images/products/"))
//   },
//   filename: function (req, file, cb) {
//     cb(null, req.body.codProduct + path.extname(file.originalname))
//   }
// })

const storage = multer.memoryStorage()

const upload = multer({ storage })

router
  .route('/')
  .get(productController.getProducts)
  .post(upload.single('image'), productController.saveProduct)
  .put(upload.single('image'), productController.updateProduct);

router
  .route('/images')
  .get(productController.getProductImages)

router
  .route('/count')
  .get(productController.getProductsCount)

router
  .route('/instances')
  .get(productController.getProductInstances)

module.exports = router;
