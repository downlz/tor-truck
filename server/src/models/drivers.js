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
  aadharno : {type : Number,required : true,unique : true}
})

// Driver Preferred routes
var preferredNodes = new mongoose.Schema ({
  nodestart : {type : String,required : true},
  nodeend : String,
  distance : {type : Number,required : true},
  cost: {type : Number},
  isactive : {type : Boolean, required : true}
})

var driverStatus = new mongoose.Schema ({
  isAssigned : {}.
  lasttripstarttime :{},
  lasttripendtime : {},
  tripid : String,           // Attach to triplog
  nextshift : Date,
  nextplannedroute : {}
})

var driverSchema = new mongoose.Schema ({
  drivername : {type : String,required : true},
  phone : {type : String,unique : true},
  address : String,
  baselocation : {type : String,required : true},
  lastservedlocation : {type : String},
  zones : [ String ],
  preferrednodes : [preferredNodes],
  workTimes : workTimeSchema,
  driverStatus : {driverStatus}
});

mongoose.model('Drivers',driverSchema);
