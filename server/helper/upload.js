const multer = require('multer');
// const moment = require('moment')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now() + '.png');
    }
});

const upload = multer ({
    storage: storage,
    destination: '../images',
    limits: {
        fileSize: 1000000
    },
    filename: (req, file, cb) => {
        
        cb(null,  file.fieldname + '-' + Date.now()) + '.png';
    },
    fileFilter (req, file, cb) {
        
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else (
            cb(null, false)
        )
    }
});

module.exports = upload;
