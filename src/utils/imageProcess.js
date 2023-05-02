const fs = require('fs')
const sharp = require('sharp')
var path = require('path')

module.exports = async (req, relPath, fileName, width = 450) => {

    try {
        fs.access(path.join(__dirname, relPath), err => {
            if (err){
                fs.mkdirSync(path.join(__dirname, relPath))
            }
        })
    
        await sharp(req.file.buffer)
            .resize({width})
            .toFile(path.join(__dirname, relPath, fileName))
    } catch(e) {
        console.log('Error while processing image', e)
    }
} 