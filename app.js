const dotenv =  require('dotenv');

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const {requireAuth,checkUser} = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config({path:'./config.env'});

// middleware
app.use(express.static('public'));
app.use(express.json({extended :false}));
app.use(cookieParser());

//everytime you use the browser back button, the page is reloaded and not cached. (Restricted  to go to protected routes after logout )
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   next();
 });


// view engine
app.set('view engine', 'ejs');

// database connection
//const dbURI = 'mongodb+srv://HarshSharma:Harsh_JWT_net-ninja@jwt-prac.cwg3b.mongodb.net/JWT2?retryWrites=true&w=majority';

const dbURI = process.env.DATABASE;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get('*',checkUser);  //Applying this to all get requests
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);

//Cookies

// app.get('/set-cookies',(req,res)=>{

// //res.setHeader('Set-cookie','newUser = true');
// res.cookie('newUser',false);
// res.cookie('isEmployee',true,{maxage: 1000 * 60 *60 * 24,httponly :true});   // An another argument {secure : true} can be used. This means that the cookie 
// ///will be available for only https connection. This should be used. But since localhost is http . We will 
// //not use it here

// //{httponly : true} will restrict cookie from showing in frontend console.
// // Here, maxage is initialised for 1 day.

// res.send('You got the cookies !');

// });

// app.get('/read-cookies',(req,res)=>{

// const cookies = req.cookies;
// console.log(cookies);
// console.log('newUser Cookie : ',cookies.newUser);
// res.json(cookies);

// });