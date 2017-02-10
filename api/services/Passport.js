/* globals User */

module.exports = {

	config: function () {

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

		// passport.use(new FacebookStrategy({
		// 	clientID: sails.config.social.facebookClientID,
		// 	clientSecret: sails.config.social.facebookClientSecret,
		// 	callbackURL: sails.config.app.host + '/auth/facebook/callback'
		// }, function (accessToken, refreshToken, profile, done) {

		// 	User.findOrCreate({facebookId: profile.id}, profile)
		// 	.exec(function)
		// }));

	}
};