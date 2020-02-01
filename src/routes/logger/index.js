

const express = require('express');

const fs = require('fs');
const zip = require('express-zip');

const router = express.Router();

router.get('/', async (req, res) => {

    var filesList = [];

    fs.readdir('logs', function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {

            filesList.push({ path: 'logs/' + file, name: file });
        });
        try {
            res.zip(filesList, filename =  'order-control-backend-loggs.zip');
        } catch (error) {
            res.status(500).json({ message: 'Internal server error: Could not load log file' });
        }
    });

});

module.exports = router;