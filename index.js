require('dotenv').config();
var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var flash = require('connect-flash');
var isLoggedIn = require('./middleware/IsLoggedIn');
var session = require('express-session');
var passport = require('./config/passportConfig');
var app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
app.use(session({  //Needs to be included above passport and flash as those modules use session
	secret: process.env.SESSION_SECRET, //In .env file
	resave: false,
	saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.currentUser = req.user; //Assigning this so we can use in all our views so we dont have to pass it thru every single time
	res.locals.alerts = req.flash();
	next();
})

// Homepage route
app.get('/', function(req, res){
	// res.send('Homepage coming soon');
	res.render('home');
});

// Profile route
app.get('/profile', isLoggedIn, function(req, res){
	res.render('profile');
});

// Controllers
app.use('/auth', require('./controllers/auth'));

// Listen port where hosted or find port 3000
app.listen(process.env.PORT || 3000);