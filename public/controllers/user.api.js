const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userModel = require('../model/userModel');
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var passport = require('passport');
require('../config/Passport')(passport);

router.use(bodyParser.urlencoded({ extended: true }));

exports.listUser = async (req, res, next) => {
  try {
    let list = await userModel.find();
    if (list) {
      return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
    } else {
      return res.status(204).json({ msg: 'Không có dữ liệu' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'error.message' });
  }
}

exports.login = async (req, res, next) => {
  try {
    var user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.status(401).send({ success: false, msg: 'User not found.' });
    } else {
      // check if password matches
      let check_pass = await bcrypt.compare(req.body.password, user.password)
      if (check_pass) {
        var token = jwt.sign(user.toJSON(), process.env.TOKEN_SEC_KEY);
        //req.session.token = 'JWT ' + token;
        console.log(token)
        return res.status(200).json({ msg: 'Logged in successfully', user: user, token: 'JWT ' + token})
      } else {
        return res.status(422).json({ msg: 'Incorrect password' })
      }
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error.message })
  }
}

exports.reg = async (req, res, next) => {
  try {
    let user = await userModel.findOne({ email: req.body.email }).lean();
    if (user) {
      return res.status(409).json({ msg: 'Email already exists' })
    } else {
      let salt = await bcrypt.genSalt(10);
      var name = req.body.name;
      var email = req.body.email;
      var password = await bcrypt.hash(req.body.password, salt);
      var image = req.file.filename;
      let user1 = new userModel({ name: name, email: email, password: password, image: image });
      user1.save();
      return res.status(200).json({ msg: 'Sign Up Success', user: user1 })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: error.message })
  }

}
exports.addUser = async (req, res, next) => {
  if (req.user.role == "Admin") {
    try {
      let user = await userModel.findOne({ email: req.body.email }).lean();
      if (user) {
        return res.status(409).json({ msg: 'Email already exists' })
      } else {
        let salt = await bcrypt.genSalt(10);
        var name = req.body.name;
        var email = req.body.email;
        var password = await bcrypt.hash(req.body.password, salt);
        var image = req.file.filename;
        let user1 = new userModel({ name: name, email: email, password: password, image: image });
        user1.save();
        return res.status(200).json({ msg: 'Add Success', user: user1 })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: error.message })
    }
  } else {
    return res.status(403).json({ msg: "You are not an Admin." })
  }

}
exports.updateUser = async (req, res, next) => {
  if (req.user.role == "Admin") {
    try {
      let user = await userModel.findOne({ _id: req.body._id }).lean();
      if (!user) {
        return res.status(401).send({ success: false, msg: 'User not found.' });
      } else {
        let id = req.body._id;
        let salt = await bcrypt.genSalt(10);
        var name = req.body.name;
        var email = req.body.email;
        var password = await bcrypt.hash(req.body.password, salt);
        var image = req.file.filename;
        let role = req.body.role;
        let user1 = await userModel.updateOne({ _id: id }, { $set: { name: name, email: email, password: password, image: image, role: role } });
        return res.status(204).json({ msg: 'Update Success' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: error.message })
    }
  } else {
    return res.status(403).json({ msg: "You are not an Admin." })
  }
}
exports.deleteUser = async (req, res, next) => {
  if (req.user.role == "Admin") {
    try {
      let user = await userModel.findOne({ _id: req.body._id }).lean();
      if (!user) {
        return res.status(401).send({ success: false, msg: 'User not found.' });
      } else {
        let id = req.body._id;
        let kq = await userModel.deleteOne({ _id: id });
        return res.status(200).json({ msg: 'Delete Success' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ msg: error.message })
    }
  } else {
    return res.status(403).json({ msg: "You are not an Admin." })
  }
}