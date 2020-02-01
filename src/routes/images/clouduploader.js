const cloudUploader = {};
const path = require('path');
const crypto = require('crypto');
const Busboy = require('busboy');
const fs = require('fs');
var root = require('./../../root');
const config = require('./../../config/config.env');
// cloudnary images
var cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'hcdvppcmt',
    api_key: '316458342187356',
    api_secret: 'W4tnKwYWvMky10TRuwLBfmTfreI'
    //https://res.cloudinary.com/hcdvppcmt/image/upload/v1576443355/users/5f8cf100723315277889189882aab420.jpg
});

// método que faz o upload da imagem para o cloudinary
cloudUploader.uploadCloud = async (req, res, type) => {
    console.log('upload image', type);
    let folderToSave;
    let uploadsDir;
    switch (type) {
        case 1:
            folderToSave = 'foods';
            uploadsDir = root + config.uploadsFoods;
            break;
        case 2:
            folderToSave = 'products';
            uploadsDir = root + config.uploadsProducts;
            break;
        case 3:
            folderToSave = 'users';
            uploadsDir = root + config.uploadsUsers;
            break;
        case 4:
            folderToSave = 'brands';
            uploadsDir = root + config.uploadsBrands;
            break;
        case 5:
            folderToSave = 'sellers';
            uploadsDir = root + config.uploadsSellers;
            break;
    }

    const busboy = new Busboy({
        headers: req.headers
    });

    let filePath;
    const uploads = {};
    let ext;

    let imgNewName = crypto.createHash('md5').update(new Date().toISOString()).digest("hex");
    busboy.on("file", (fieldname, file, filename) => {

        ext = filename.split('.').pop();

        filePath = path.join(uploadsDir, imgNewName + '.' + ext);
        uploads[fieldname] = filePath;
        file.pipe(fs.createWriteStream(filePath));

    });
    busboy.on('finish', async () => {
        console.log('salvando cloudnary', filePath)
        console.log('salvando cloudnary', folderToSave)
        cloudinary.uploader.upload(filePath, { folder: folderToSave, public_id: imgNewName }, callback => {
            if (callback) {
                console.log('erro ao subir a imagem no server', callback);
                return res.status(200).send({
                    status: 'error',
                    error: callback
                });
            }
            else {
                console.log('imgnewname', imgNewName);
                return res.status(200).send({
                    status: 'ok',
                    img: imgNewName + '.' + ext
                });
            }

        });
    });

    if (req.rawBody) {
        busboy.end(req.rawBody);
    } else {
        req.pipe(busboy)
    }

}


module.exports = cloudUploader;