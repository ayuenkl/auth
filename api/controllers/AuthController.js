/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},

	login: function (req, res) {
		passportCallback('local', req, res);
	},

	logout: function (req, res) {
		req.logout();
		res.redirect('/');
	},

	facebookLogin: function (req, res) {
		passport.authenticate('facebook', { scope: ['user_about_me', 'email']})(req, res);
	},

	facebookCallback: function (req, res) {
		passportCallback('facebook', req, res);
	}
};

function passportCallback(provider, req, res) {

	passport.authenticate(provider, function (err, user, info) {

		if ((err) || (!user)) {
			return res.negotiate(err);
		}

		req.logIn(user, function (err) {

			if (err) res.send(err);

			return res.send({
				message: info.message,
				user: user
			});
		});

	})(req, res);
}