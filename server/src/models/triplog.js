/* eslint-disable */
var mongoose = require( 'mongoose' );

// Storing Trip Zone
var tripZone = new mongoose.Schema ({
  startzone : {type : String,required : true},
  endzone : [String]
})

// Trip Status
var tripStatus = new mongoose.Schema ({
  requestedon : {type : String,required : false},
  isconfirmed : String,
  confirmedon : {type : Number,required : false},
  currentlocation : {type : String},
  lastKnownlocation : {type : String}, //{type : [Number], index : '2dsphere',required : false},
  currentassigneddriver : {type : String},
  nextdssigneddriver : {type : String},
  previousdssigneddriver : {type : String},
  eta : Date
})

// Main Trip Schema
var tripSchema = new mongoose.Schema ({
  tripid = String,
  selectedRoute : {type : String,required : true},
  assignedDrivers : {type : String,unique : true},
  cost : String,
  zones : {tripZone},
  tripstatus : {tripStatus}
});

mongoose.model('Trip',tripSchema);
