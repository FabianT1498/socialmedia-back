const express = require('express');
const multer = require("multer");
var path = require('path')

const publicityController = require('../controllers/publicityController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, path.join(__dirname, "./../../images/publicidad/"))
  },
  filename: function (req, file, cb) {
    let fileName = file.fieldname + '-' + Date.now();
    let filePath = fileName + path.extname(file.originalname)
    req.fileName = fileName
    req.filePath = filePath
    cb(null, filePath)
  }
})

const upload = multer({ storage: storage })

router
  .route('/')
  .get(publicityController.getPublicity)
  .post(upload.single('image'), publicityController.savePublicity)

router
  .route('/:name')
  .delete(publicityController.deletePublicity)

module.exports = router;
