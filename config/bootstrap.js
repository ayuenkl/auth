/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  /* globals User */

	var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	//FacebookStrategy = require('passport-facebook').Strategy,
	bcrypt = require('bcrypt');

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({id: id}, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function (email, password, done) {

		User.findOne({email: email}, function (err, user) {

			if (err) { return done(err); }

			if (!user) {
				return done(null, false, {message: 'Incorrect email.'});
			}

			bcrypt.compare(password, user.password, function (err, res) {

				if (!res) {
					return done(null, false, {message: 'Invalid Password'});
				}

				var returnUser = {
					email: user.email,
					createdAt: user.createdAt,
					id: user.id
				};

				return done(null, returnUser, {message: 'Logged In Successfully'});
			});
		});
	}));

	console.log('testing...');
	console.log('local variable is ', sails.config.social.facebookID);

  	cb();
};
