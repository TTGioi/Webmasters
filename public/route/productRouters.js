var express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const product = require('../js/product');
const uri = 'mongodb+srv://nvu806101:19ShRC4UNeVi69Dz@cluster0.iupvbq2.mongodb.net/Database?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
const productModel = require('../model/productModel');
var passport = require('passport');
require('../config/Passport')(passport);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.use((req, res, next) => {
    if (req.session.token) {
      req.headers.authorization = `${req.session.token}`;
    }
    next();
  });

router.get('/listProducts',passport.authenticate("jwt", { session: false }), async (req, res) => {
    await mongoose.connect(uri);
    let listProducts = await productModel.find().lean();
    res.render('product/listProducts', { products: listProducts, quanly: true, user: req.user.role});
});

router.get('/addProduct',passport.authenticate("jwt", { session: false }) ,(req, res) => {
    res.render('product/addProduct', { addSp: true ,user: req.user.role});
});

router.post('/addProduct',passport.authenticate("jwt", { session: false }), upload.single('image'), async (req, res, callback) => {
    await mongoose.connect(uri);
    if (req.body.id !== undefined) {
        let files = req.file;
        let id = req.body.id;
        let name = req.body.name;
        let price = req.body.price;
        let color = req.body.color;
        if (!files) {
            let image2 = req.body.image2;
            await productModel.updateOne({ _id: id }, { $set: { name: name, price: price, color: color, image: image2 } });
        }else{
            let image = req.file.filename;
            await productModel.updateOne({ _id: id }, { $set: { name: name, price: price, color: color, image: image } });
        } 
        let listProducts = await productModel.find().lean();
        res.render('product/listProducts', { products: listProducts, quanly: true ,user: req.user.role});
    } else {
        let files = req.file;
        if (!files) {
            const error = new Error('Please choose files')
            error.httpStatusCode = 400
            return callback(error)
        }
        let name = req.body.name;
        let price = req.body.price;
        let color = req.body.color;
        let image = req.file.filename;
        let product1 = new productModel({ name: name, price: price, color: color, image: image });
        await product1.save();
        res.render('product/addProduct', { refresh: true, addSp: true, successAdd: true ,user: req.user.role});
    }
});

router.post('/actionProduct',passport.authenticate("jwt", { session: false }), async (req, res) => {
    await mongoose.connect(uri);
    if (req.body.update == "update") {
        let id = req.body.id;
        let name = req.body.name;
        let price = req.body.price;
        let color = req.body.color;
        let image = req.body.image;
        let product1 = new product(name, image, price, color)
        res.render('product/updateProduct', { product1, id: id, quanly: true,user: req.user.role });
    } else {
        let id = req.body.idDelete;
        let kq = await productModel.deleteOne({ _id: id });
        console.log(kq);
        let listProducts = await productModel.find().lean();
        res.render('product/listProducts', { products: listProducts, quanly: true, successDelete: true ,user: req.user.role});
    }
});

// Xuất bộ định tuyến này để có thể sử dụng ở file khác
module.exports = router;