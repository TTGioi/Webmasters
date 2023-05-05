const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const productModel = require('../model/productModel');
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var passport = require('passport');
require('../config/Passport')(passport);



exports.listProduct = async (req, res, next) => {
    try {
        let list = await productModel.find();
        if (list) {
            return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
        } else {
            return res.status(204).json({ msg: 'Không có dữ liệu' });
        }
    } catch (error) {
        return res.status(500).json({ msg: 'error.message' });
    }
}

exports.addProduct = async (req, res, next) => {
    try {
        let files = req.file;
        if (!files) {
            return res.status(400).json({ msg: "Please choose files" })
        }
        let name = req.body.name;
        let price = req.body.price;
        let color = req.body.color;
        let image = req.file.filename;
        let product1 = new productModel({ name: name, price: price, color: color, image: image });
        await product1.save();
        return res.status(200).json({ msg: 'Add Success', product: product1 })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await productModel.findOne({ _id: req.body._id }).lean();
        if (!product) {
            return res.status(401).send({ success: false, msg: 'Product not found.' });
        } else {
            let files = req.file;
            if (!files) {
                return res.status(400).json({ msg: "Please choose files" })
            }
            let id = req.body._id;
            let name = req.body.name;
            let price = req.body.price;
            let color = req.body.color;
            let image = req.file.filename;
            await productModel.updateOne({ _id: id }, { $set: { name: name, price: price, color: color, image: image } });
            return res.status(200).json({ msg: 'Update Success' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}
exports.deleteProduct = async (req, res, next) => {
    try {
        let product = await productModel.findOne({ _id: req.body._id }).lean();
        if (!product) {
            return res.status(401).send({ success: false, msg: 'User not found.' });
        } else {
            let id = req.body._id;
            let kq = await productModel.deleteOne({ _id: id });
            return res.status(204).json({ msg: 'Delete Success' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }

}