/* eslint-disable */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var regSchema = new mongoose.Schema({
  email :{
    type : String,
    unique : true,
    required :true
  },
    password :{
      type : String,
      required : true
    }
  })
/*
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha256').toString('hex');
};

userSchema.methods.validPassword = function(password){
  var hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha256').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function(){
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id : this._id,
    email : this.email,
    name : this.name,
    exp : parseInt(expiry.getTime() / 1000),
  },process.env.JWT_SECRET);
};
*/
mongoose.model('Register', regSchema);
/*var user = new User();
user.name = "User's Name";
user.email = "test@example.com";
user.setPassword("myPassword");
user.save();*/
