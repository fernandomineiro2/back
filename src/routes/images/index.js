const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const path = require('path');
const fs = require('fs');
const environment = require('./../../config/config.env.js');
var root = require('./../../root');
const uploaderCloud = require('../images/clouduploader');

const userDir = environment.uploadsUsers;
const foodDir = environment.uploadsFoods;
const staffDir = environment.uploadsStaff;
const brandsDir = environment.uploadsBrands;
const sellersDir = environment.uploadsSellers


router.get('/users/:id', async (req, res, next) => {
    const id = req.params.id;

    const file = path.join(root, userDir, id);

    return downloadFile(file, res);
});

router.get('/staff/:id', async (req, res, next) => {

    const id = req.params.id;

    const file = path.join(root, staffDir, id);

    return downloadFile(file, res);
});

router.get('/food/:id', async (req, res, next) => {

    const id = req.params.id;

    const file = path.join(root, foodDir, id);

    return downloadFile(file, res);
});

router.get('/servers/:id', async (req, res, next) => {

    const id = req.params.id;

    const file = path.join(root, foodDir, id);

    return downloadFile(file, res);
});

router.get('/brands/:id', async (req, res, next) => {

    const id = req.params.id;

    const file = path.join(root, brandsDir, id);

    return downloadFile(file, res);
});

router.get('/sellers/:id', async (req, res, next) => {

    const id = req.params.id;

    const file = path.join(root, sellersDir, id);

    return downloadFile(file, res);
});

// cloudnary images upload simple

router.post('/cloudImage', function (req, res) {

    return uploaderCloud.uploadCloud(req, res, 1);
});




function downloadFile(file, res) {
    if (fs.existsSync(file)) {
        fs.readFile(file, function (err, data) {
            if (err) throw err;
            res.write(data);
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
}

module.exports = router;