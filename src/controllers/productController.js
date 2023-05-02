var path = require('path')
const fs = require('fs')

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

const {db, helpers } = require('./../../database')
const Product = require('./../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const imageProcess = require('./../utils/imageProcess');

let currentRequest = null;
const pendingRequest = []

const getProductInstancesRequest = (sql, res) => new Request(sql, function(err, rowCount, rows) {
    if (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            data: null
        }); 
        return;
    }

    let data = rows.map((item) => {
        return {
            codInst: item[0].value,
            descrip: item[1].value
        }
    })

    res.status(200).json({
        status: 'success',
        data
    });
});

const getProductsRequest = (sql, res) => new Request(sql, function(err, rowCount, rows) {
    
    if (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            data: []
        }); 
        return;
    }

    let data = rows.map((item) => {
        return {
            codProduct: item[0].value,
            precioManual: item[1].value,
            precioBs: item[2].value,
            precioDiv: item[3].value,
            descrip: item[4].value,
            IVA: item[5].value / 100,
            codInst: item[6].value,
            imgFile: { uid: '-1', name: '', status: 'done',url: "" },
            visible: 0
        }
    })

    console.log(rows)

    res.status(200).json({
        status: 'success',
        data
    });
});

const getProductsCountRequest = (sql, cb, params) => new Request(sql, function(err, rowCount, rows) {
    cb({...params, err, rows})
});

const productsCountResponseCb = (params) => {

    const {res, err, rows} = params

    if (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            data: []
        }); 
        return;
    }

    res.status(200).json({
        status: 'success',
        data: {
            count: rows[0][0].value
        }
    });
}

const onCompleteCallback = function(conn){
  
    if (pendingRequest.length > 0){
        currentRequest = pendingRequest.shift()
        currentRequest.on('requestCompleted', () => onCompleteCallback(conn));
        conn.db.execSql(currentRequest);
    } else {
        currentRequest = null
    }
}

exports.getProductInstances = catchAsync(async (req, res, next) => {

    // make the query
    let sql = 'SELECT CodInst, Descrip FROM SAINSTA WHERE Nivel = 0 AND InsPadre = 0'
    
    let conn = db.getDatabase('saint_db_conn');
    let request = getProductInstancesRequest(sql, res);

    if (!conn.error){
        if (!currentRequest){
            currentRequest = request
            currentRequest.on('requestCompleted', () => onCompleteCallback(conn));
            conn.db.execSql(currentRequest)
        } else {
            pendingRequest.push(request)
        }
    } else {
        res.status(500).json({
            status: 500,
            data: []
        }); 
    }  
})

exports.getProducts = catchAsync(async (req, res, next) => {
    let sql = `SELECT SAPROD.CodProd AS CodProd, SAPROD_02.Precio_Manual as PrecioManual,
            CASE WHEN SAPROD_02.Precio_Manual = 1 
                THEN SAPROD_02.Profit1 * (SELECT Factor from SACONF)
                ELSE CAST(ROUND(((SAPROD.CostPro/(SELECT FactorP from SACONF))/((100 - SAPROD_02.Profit1)/100)) * (SELECT FactorP from SACONF), 2) AS decimal(15, 2))  END AS Precio,
            CASE WHEN SAPROD_02.Precio_Manual = 1 
                THEN SAPROD_02.Profit1 
                ELSE CAST(ROUND(((SAPROD.CostPro/(SELECT FactorP from SACONF))/((100 - SAPROD_02.Profit1)/100)), 2) AS decimal(15, 2))  END AS PrecioDiv,
            SAPROD.Descrip as Descrip,
            SATAXPRD.Monto as IVA,
            SAPROD.CodInst as CodInst
            FROM SAPROD
            INNER JOIN SAPROD_02 ON SAPROD.CodProd = SAPROD_02.CodProd 
            LEFT JOIN SATAXPRD ON SAPROD.CodProd = SATAXPRD.CodProd WHERE Activo = @activo
        `

    let conn = db.getDatabase('saint_db_conn');

    if (!conn.error){

        let descrip = req.query.descrip;
        let activo = req.query.activo;
        let exists = req.query.exists;
        let codInst = req.query.codInst
        let page = req.query.page !== undefined ? req.query.page : null;
        let size = req.query.size !== undefined ? req.query.size : null;

        let queryFilters = {
            activo: 1,
            codInst: 1651,
            descrip: '',
            exists: 1     
        };
        
        if (descrip !== undefined && descrip !== ''){
            queryFilters['descrip'] = descrip;
            sql += ` AND (SAPROD.Descrip LIKE '%' + @descrip + '%' OR SAPROD.CodProd LIKE '%' + @descrip + '%')`
        }

        if (activo !== undefined && activo !== ''){
            queryFilters['activo'] = activo;  
        }

        if (exists !== undefined && exists !== ''){
            queryFilters['exists'] = exists;  
            sql += ` AND SAPROD.Existen ${exists === '1' ? '>' : '=' } 0`
        }

        if (codInst !== undefined && codInst !== '' && codInst !== '0'){
            queryFilters['codInst'] = codInst;
            sql += ' AND CodInst = @codInst'
        }

        sql += ' ORDER BY CodProd DESC'

        if (page && size){
            sql += ' OFFSET ' + (page - 1) * size + ' ROWS FETCH NEXT '
                + size + ' ROWS ONLY;'
        }

        

        let request = getProductsRequest(sql, res)
        request.addParameter('activo', TYPES.SmallInt, queryFilters['activo']);

        if (codInst !== undefined && codInst !== '' && codInst !== '0'){
            request.addParameter('codInst', TYPES.Int, queryFilters['codInst']);
        }

        if (descrip !== undefined && descrip !== ''){
            request.addParameter('descrip', TYPES.NVarChar, queryFilters['descrip']);
        }

        if (!currentRequest){
            currentRequest = request
            currentRequest.on('requestCompleted', () => onCompleteCallback(conn));
            conn.db.execSql(currentRequest)
        } else {
            pendingRequest.push(request)
        }
    } else {
        res.status(500).json({
            status: 500,
            data: []
        }); 
    }  
})

exports.getProductImages = catchAsync(async (req, res, next) => {
    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }

        const codProducts = req.query.codProducts
        
        let sql = `SELECT * FROM img_productos WHERE cod_product IN (${codProducts})`

        connection.query(sql, function(err, results) {
            connection.release();
            if(err) { 
                console.log(err);
                res.send(500,"Server Error");
                return; 
            }
 
            res.status(200).json({
                status: 'success',
                data: results
            });
        });
    });
})

exports.getProductsCountQuery = ({activo = '1', codInst = '0', descrip = '', exists = '1'}, cb, cbParams) => {
    let sql = `SELECT COUNT(SAPROD.CodProd) as productCount FROM SAPROD 
        INNER JOIN SAPROD_02 ON SAPROD.CodProd = SAPROD_02.CodProd 
        LEFT JOIN SATAXPRD ON SAPROD.CodProd = SATAXPRD.CodProd WHERE Activo = @activo`

    let conn = db.getDatabase('saint_db_conn');

    if (!conn.error){

        if (descrip !== ''){
            sql += ` AND (SAPROD.Descrip LIKE '%' + @descrip + '%' OR SAPROD.CodProd LIKE '%' + @descrip + '%')`
        }

        if (exists !== undefined && exists !== ''){
            sql += ` AND SAPROD.Existen ${exists === '1' ? '>' : '=' } 0`
        }

        if (codInst !== undefined && codInst !== '' && codInst !== '0'){
            sql += ' AND CodInst = @codInst'
        }

        let request = getProductsCountRequest(sql, cb, cbParams)

        request.addParameter('activo', TYPES.SmallInt, activo);

        if (codInst !== undefined && codInst !== '' && codInst !== '0'){
            request.addParameter('codInst', TYPES.Int, codInst);
        }

        if (descrip !== undefined && descrip !== ''){
            request.addParameter('descrip', TYPES.NVarChar, descrip);
        }

        if (!currentRequest){
            currentRequest = request
            currentRequest.on('requestCompleted', () => onCompleteCallback(conn));
            conn.db.execSql(currentRequest)
        } else {
            pendingRequest.push(request)
        }
    } else {
        res.status(500).json({
            status: 500,
            data: 0
        }); 
    }  
}

exports.getProductsCount = catchAsync(async (req, res, next) => {
    
    let queryFilters = {}
    let descrip = req.query.descrip;
    let activo = req.query.activo;
    let exists = req.query.exists;
    let codInst = req.query.codInst

    if (descrip !== undefined && descrip !== ''){
        queryFilters['descrip'] = descrip
    }

    if (activo !== undefined && activo !== ''){
        queryFilters['activo'] = activo
    }

    if (exists !== undefined && exists !== ''){
        queryFilters['exists'] = exists;  
    }

    if (codInst !== undefined && codInst !== ''){
        queryFilters['codInst'] = codInst
    }
   
    exports.getProductsCountQuery(queryFilters, productsCountResponseCb, { res })
})

exports.updateProduct =  catchAsync(async (req, res, next) => {
    let codProduct = req.body.codProduct !== undefined ? req.body.codProduct : ''
    let visible = req.body.visible !== undefined ? req.body.visible : 0

    let isFileUploading = req.file !== undefined

    let fileName = ''
    let targetPath = ''

    if (isFileUploading){
        let oldFileExtension = req.body.oldFileExtension !== undefined ? req.body.oldFileExtension : ''
    
        if (path.extname(req.file.originalname) !== oldFileExtension){
            fs.unlink(path.join(__dirname, "./../../images/products/", codProduct + oldFileExtension), (err) => {
                if (err) throw err;
                console.log('file was deleted');
            })
        }

        fileName = codProduct  + path.extname(req.file.originalname);
        targetPath = 'products/' + fileName;
        await imageProcess(req, './../../images/products', fileName)
    }

    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }

        let sql = `UPDATE img_productos SET visible = ${visible} ${isFileUploading ? ', url = \'' + targetPath + '\'' : ''}  WHERE cod_product = '${codProduct}'`

        connection.query(sql, function(err, results) {
            connection.release();
            if(err) { 
                console.log(err);
                res.send(500,"Server Error");
                return; 
            }
            
            res.status(200).json({
                status: 'success',
                data: {
                    url: targetPath,
                    name: req.body.codProduct
                }
            });
        });
    });
})

exports.saveProduct = catchAsync(async (req, res, next) => {

    const fileName = req.body.codProduct  + path.extname(req.file.originalname);
    const targetPath = 'products/' + fileName;

    await imageProcess(req, './../../images/products', fileName)

    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }

        let sql = 'INSERT INTO img_productos (cod_product,url) VALUES (?,?)'

        connection.query(sql, [req.body.codProduct, targetPath], function(err, results) {
            connection.release();
            if(err) { 
                console.log(err);
                res.send(500,"Server Error");
                return; 
            }
            
            res.status(200).json({
                message: 'success',
                data: {
                    url: targetPath,
                    name: req.body.codProduct
                }
            });
        });
    });
})
