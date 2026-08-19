const router = require('express').Router();

const { isAuth } = require('../middlewares/isAuth');
const { uploadImage } = require('../controllers/uploadImage.controller');
const { parseUploadImage } = require('../middlewares/uploadImage.middleware');

router.post('/', isAuth, parseUploadImage, uploadImage);

module.exports = router;