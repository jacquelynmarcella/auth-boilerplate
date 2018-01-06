var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models');

passport.serializeUser(function(user, callback){
	callback(null, user.id);
});

passport.deserializeUser(function(id, callback){
	db.user.findById(id).then(function(user){
		callback(null, user);
	}).catch(function(err){
		callback(err, null);
	});
});

passport.use(new localStrategy({
	usernameField: 'email', //Assumes username is default login field, but we are doing email
	passwordField: 'password'
}, function(email, password, callback){
	db.user.findOne({
		where: { email: email } //Where email is what we passed in/what was typed
	}).then(function(user){ //If user is found by their email...
		if(!user || !user.isValidPassword(password)){ //If not user or not valid pw
			callback(null, false);
		} 
		else { //If user valid and the user has the correct PW
			callback(null, user); //Send user object
		} 
	}).catch(function(err){
		callback(err, null);
	})
}));

module.exports = passport;