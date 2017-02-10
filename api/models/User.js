/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

  	FacebookId: {
      type: 'string'
    },

    email: {
  		type: 'email',
  	},

  	password: {
  		type: 'string',
  	},

  	toJSON: function () {
  		var obj = this.toObject();
  		delete obj.password;
  		return obj;
  	}
  },

  beforeCreate: function (user, cb) {

  	if (user.password) {

      bcrypt.genSalt(10, function (err, salt) {

    		bcrypt.hash(user.password, salt, function (err, hash) {

    			if (err) {
    				console.log(err);
    				return cb(err);
    			} else {
    				user.password = hash;
    				return cb();
    			}
    		});
    	});
    } else {
      return cb();
    }
  }
};

