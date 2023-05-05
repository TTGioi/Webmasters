const express = require('express');
const router = express.Router();
var api_u = require('../controllers/user.api');
var api_pd = require('../controllers/product.api');
var passport = require('passport');
require('../config/Passport')(passport);
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = './public/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        var tenGoc = file.originalname;
        arr = tenGoc.split('.');
        let newFileName = '';
        for (var i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }
        cb(null, newFileName)
    }
})
var upload = multer({
    storage: storage,
})
//api user
router.get('/users', passport.authenticate("jwt", { session: false }), api_u.listUser);
router.post('/users/login', api_u.login);
router.post('/users/reg', upload.single('image'), api_u.reg);
router.post('/users/add', passport.authenticate("jwt", { session: false }),upload.single('image'), api_u.addUser);
router.put('/users/update', passport.authenticate("jwt", { session: false }),upload.single('image'), api_u.updateUser);
router.delete('/users/delete', passport.authenticate("jwt", { session: false }), api_u.deleteUser);

// api update
router.get('/products', passport.authenticate("jwt", { session: false }), api_pd.listProduct); 
router.post('/products/add', passport.authenticate("jwt", { session: false }),upload.single('image'), api_pd.addProduct); 
router.put('/products/update', passport.authenticate("jwt", { session: false }),upload.single('image'), api_pd.updateProduct); 
router.delete('/products/delete', passport.authenticate("jwt", { session: false }), api_pd.deleteProduct); 

module.exports = router;
