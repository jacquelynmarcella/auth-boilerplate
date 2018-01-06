var express = require('express');
var passport = require('../config/passportConfig');
var db = require('../models');
var router = express.Router();

// Login form page
router.get('/login', function(req, res){
	res.render('auth/login');
});

// Where login form data gets sent
router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	successFlash: 'Login successful',
	failureRedirect: '/auth/login',
	failureFlash: 'Username or password is incorrect'

	// Started w/ the below:
	// console.log('req.body is ' + req.body);
	// res.send('login post route coming soon');
	// After testing route, once other stuff configed, took out req, res
	// Then, added a call to passport
}));

// Signup form page
router.get('/signup', function(req, res){
	res.render('auth/signup');
});

// Where signup form data gets sent
router.post('/signup', function(req, res, next){
	// console.log(req.body);
	// res.send('signup post route coming soon');

	db.user.findOrCreate({
		where: { email: req.body.email },
		defaults: {
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			password: req.body.password
		}
	}).spread(function(user, wasCreated){
		if(wasCreated){
			//Good job, you didnt make a duplicate and youre in the db
			passport.authenticate('local', {
				successRedirect: '/profile',
				successFlash: 'Login successful'
			})(req, res, next);
		}
		else {
			// Bad job, you tried to make a dupe
			req.flash('error', 'Email already exists');
			res.redirect('/auth/login');
		}
	}).catch(function(err){
		req.flash('error', err.message);
		res.redirect('/auth/signup');
	});
});

// Logout page
router.get('/logout', function(req, res){
	// res.send('logout route coming soon');
	req.logout();
	req.flash('success', 'Successfully logged out');
	res.redirect('/');
});

module.exports = router;