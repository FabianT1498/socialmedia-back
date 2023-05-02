const express = require('express');

const visorController = require('./../controllers/visorController');

const router = express.Router();

router
  .route('/:codInst')
  .get(visorController.getProductsPage)
  
module.exports = router;
