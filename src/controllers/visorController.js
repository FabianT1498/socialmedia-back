const catchAsync = require('./../utils/catchAsync');

const productController = require('./../controllers/productController');

exports.getProductsPage = catchAsync(async (req, res, next) => {
    
    const codInst = req.params.codInst;

    productController.getProductsCountQuery({codInst})

    res.status(200).json({
        status: 'success',
        data: 'Se ha recuperado todas las sesion'
    });
})