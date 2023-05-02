var path = require('path')
const fs = require('fs')

const {db, helpers } = require('./../../database')
const catchAsync = require('./../utils/catchAsync');

exports.getPublicity = catchAsync(async (req, res, next) => {
    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }
        
        let sql = `SELECT * FROM img_publicidades`

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

exports.savePublicity = catchAsync(async (req, res, next) => {
    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }
        
        console.log(req.fileName)
        const fileName = req.fileName
        const filePath = req.filePath
        const targetPath = 'publicidad/' + filePath
        let sql = 'INSERT INTO img_publicidades (name, url) VALUES (?,?)'

        connection.query(sql, [fileName, targetPath], function(err, results) {
            connection.release();
            if(err) { 
                console.log(err);
                res.send(500,"Server Error");
                return; 
            }
            
            res.status(200).json({
                status: 'success',
                data: {
                    name: fileName,
                    url: targetPath
                }
            });
        });     
    });
})

exports.deletePublicity = catchAsync(async (req, res, next) => {
    db.getDatabase('visor_productos_db').getConnection(function(err, connection) {
        if(err) { 
            console.log(err);
            res.send(500,"Server Error");  
            return; 
        }

        console.log(req.body)

        const name = req.body.name;
        const url = req.body.url;

        let sql = 'DELETE FROM img_publicidades WHERE name = ?'

        connection.query(sql, [name], function(err, results) {
            connection.release();
            console.log(results)
            if(err) { 
                console.log(err);
                res.send(500,"Server Error");
                return; 
            }

            fs.unlink(path.join(__dirname, "./../../images/", url), (err) => {
                if (err) throw err;
                console.log('file was deleted');
            })
            
            res.status(200).json({
                status: 'success',
                data: {
                  data: results
                }
            });
        });
    });
})
