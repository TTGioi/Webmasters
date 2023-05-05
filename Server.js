require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
//import { engine } from 'express-handlebars';
const expressHbs = require('express-handlebars');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express()

var session = require('express-session');

var userRouters = require('./public/route/userRouters');
var api = require('./public/route/api');
var productRouters = require('./public/route/productRouters');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//app.engine('.hbs', ExpressHandlebars());


const sum = (a,b) => a+b;
const check_role = (role) =>{
  if(role == "Admin"){
    return true;
  }else{
    return false;
  }
}
app.engine('.hbs', expressHbs.engine({ defaultLayout: 'main', extname: "hbs", layoutsDir: './views/layouts' ,helpers:{sum:sum,role: check_role}}));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(session({
  secret: process.env.KEY_SESSION, // chuỗi ký tự đặc biệt để Session mã hóa, tự viết
  resave: false,
  saveUninitialized: false
}));
// app.use((req, res, next) => {
//   if (req.session.token) {
//     req.headers.authorization = `${req.session.token}`;
//   }
//   next();
// });


app.get('/', (req, res) => {
  res.render('auth/login', { layout: "auth" })
});

app.get('/logup', (req, res) => {
  res.render('auth/logup', { layout: "auth" })
});


app.use('/',productRouters);
app.use('/',userRouters);
app.use('/api',api);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
