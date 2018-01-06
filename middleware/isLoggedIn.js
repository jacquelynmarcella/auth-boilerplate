// Detect if we are logged in our not:
module.exports = function(req, res, next){
	if(!req.user){ // If not logged in, show this error
		req.flash('error', 'You must be logged in to view this page');
		res.redirect('/auth/login');
	}
	else {
		next(); //Otherwise, keep on moving
	}
}



