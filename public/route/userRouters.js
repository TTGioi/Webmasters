const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const user = require('../js/user');
const bodyParser = require('body-parser');
const userModel = require('../model/userModel');
var jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
var request = require('request');
var passport = require('passport');
require('../config/Passport')(passport);

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


router.get('/profile', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let id = req.user._id;
  var user2 = await userModel.findOne({ _id: id });
   console.log(user2)
  let name = user2.name;
  let email = user2.email;
  let password = user2.password;
  let image = user2.image;
  let role = user2.role;
  var user1 = new user(name, email, password, image)
  if(role == "Admin"){
    res.render('user/profile', { user1, id: id, user: true, profile: true, user: req.user.role, admin:true });
  }else{
    res.render('user/profile', { user1, id: id, user: true, profile: true, user: req.user.role });
  }
});

router.get('/listUsers', passport.authenticate("jwt", { session: false }), async (req, res) => {
  let listUsers = await userModel.find().lean();
  res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true, user: req.user.role });
});

router.get('/logOut', passport.authenticate("jwt", { session: false }), async (req, res) => {
  req.session.token = null;
  res.redirect('/');
});

router.get('/addUser', passport.authenticate("jwt", { session: false }), (req, res) => {
  res.render('user/addUser', { addUser: true, user: req.user.role });
});
// router.get('/addUser', passport.authenticate("jwt", { session: false }), (req, res) => {
//   const response = {
//     addUser: true,
//     user: req.user.role
//   };
//   res.json(response);
// });
router.post('/updateProfile', passport.authenticate("jwt", { session: false }), upload.single('image'), async (req, res, callback) => {
  if (req.body.id !== undefined) {
    let salt = await bcrypt.genSalt(10);
    let files = req.file;
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let password =  await bcrypt.hash(req.body.password, salt);
    let role = req.body.role;
    if (!files) {
      let image2 = req.body.image2;
      await userModel.updateOne({ _id: id }, { $set: { name: name, email: email, password: password, image: image2, role: role } });
    } else {
      let image = req.file.filename;
      await userModel.updateOne({ _id: id }, { $set: { name: name, email: email, password: password, image: image, role: role } });
    }
    res.render('user/profile',{successProfile:true});
  }
});
router.post('/addUser', passport.authenticate("jwt", { session: false }), upload.single('image'), async (req, res, callback) => {

  console.log('Ket noi DB thanh cong!');

  if (req.body.id !== undefined) {
    let salt = await bcrypt.genSalt(10);
    let files = req.file;
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let password =  await bcrypt.hash(req.body.password, salt);
    let role = req.body.role;
    if (!files) {
      let image2 = req.body.image2;
      await userModel.updateOne({ _id: id }, { $set: { name: name, email: email, password: password, image: image2, role: role } });
    } else {
      let image = req.file.filename;
      await userModel.updateOne({ _id: id }, { $set: { name: name, email: email, password: password, image: image, role: role } });
    }
    let listUsers = await userModel.find().lean();
    res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true, user: req.user.role });
  } else {
    let files = req.file;
    if (!files) {
      const error = new Error('Please choose files')
      error.httpStatusCode = 400
      return callback(error)
    }
    try {
      let salt = await bcrypt.genSalt(10);
      let name = req.body.name;
      let email = req.body.email;
      let password = await bcrypt.hash(req.body.password, salt);
      let image = req.file.filename;
      let role = req.body.role;
      let user1 = new userModel({ name: name, email: email, password: password, image: image, role: role });
      await user1.save();
      res.render('user/addUser', { refresh: true, addUser: true, successAdd: true, user: req.user.role });
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: error.message })
    }
  }
});


router.post('/actionUser', passport.authenticate("jwt", { session: false }), async (req, res) => {
  console.log('Ket noi DB thanh cong!');
  if (req.body.update == "update") {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let image = req.body.image;
    let role = req.body.role;
    var user1 = new user(name, email, password, image)
    if (role == "User") {
      res.render('user/updateUser', { user1, id: id, user: true, danhSachUser: true, user: req.user.role });
    } else {
      res.render('user/updateUser', { user1, id: id, admin: true, danhSachUser: true, user: req.user.role });
    }
  } else {
    let id = req.body.idDelete;
    let kq = await userModel.deleteOne({ _id: id });
    console.log(kq);
    let listUsers = await userModel.find().lean();
    res.render('user/listUsers', { listUsers: listUsers, danhSachUser: true, successDelete: true, user: req.user.role });
  }
});

router.post('/logup', upload.single('image'), async (req, res, callback) => {
  const files = req.file
  if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return callback(error);
  }
  try {
    let user = await userModel.findOne({ email: req.body.email }).lean();
    if (user) {
      return res.render('auth/logup', { layout: "auth", check: true, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password, image: req.file.filename });
    } else {
      let salt = await bcrypt.genSalt(10);
      var name = req.body.firstname + req.body.lastname;
      var email = req.body.email;
      var password = await bcrypt.hash(req.body.password, salt);
      var image = req.file.filename;
      let user1 = new userModel({ name: name, email: email, password: password, image: image });
      user1.save();
      res.render('auth/login', { layout: "auth" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: error.message })
  }
});

router.post('/login', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
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
        req.session.token = 'JWT ' + token;
        console.log(token)
        request.get('http://localhost:3000/listProducts', {
          headers: { 'Authorization':  req.session.token }
        }, function (error, response, body) {
          res.send(body);
        });
      } else {
        res.render('auth/login', { layout: "auth", check: true, email: email, password: password });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: error.message })
  }
});

// Xuất bộ định tuyến này để có thể sử dụng ở file khác
module.exports = router;