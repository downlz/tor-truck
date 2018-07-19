/* eslint-disable */
var mongoose = require( 'mongoose' );
var workTimeSchema = new mongoose.Schema ({
  days : {type : String,required : false},
  start : String,
  end : String,
  off : {type : Boolean, required : false}
});

// Sensitive Personal Information
var spiSchema = new mongoose.Schema ({
  license : {type : String,required : true},
  family : [String],
  aadharno : {type : Number,required : true}
})

var driverSchema = new mongoose.Schema ({
  drivername : {type : String,required : true},
  phone : [String],
  address : String,
  baselocation : {type : String,required : true},
  lastservedlocation : {type : String},
  zones : [String],
  preferrednodes : [String],
  workTimes : workTimeSchema
});

mongoose.model('Drivers',driverSchema);
