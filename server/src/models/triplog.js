/* eslint-disable */
var mongoose = require( 'mongoose' );

// Storing Trip Zone
var tripZone = new mongoose.Schema ({
  startzone : {type : String},
  endzone : {type : String}
})

// Trip Status
var tripStatus = new mongoose.Schema ({
  status : String,                     //TENTATIVE,ALLOCATED,CANCELLED,ENROUTE,COMPLETED,DELAYED
  requestedon : Date,
  isconfirmed : {type : Boolean, "default" : false},
  confirmedon : Date,
  isontrip : {type : Boolean, "default" : false},
  currentlocation : {type : String},
  lastKnownlocation : {type : String}, //{type : [Number], index : '2dsphere',required : false},
  currentassigneddriver : {type : String},
  nextassigneddriver : {type : String},
  previousassigneddriver : {type : String},
  eta : Date
})

// Main Trip Schema
var tripSchema = new mongoose.Schema ({
  tripid : String,
  assignedRouteDrivers : [],
  tripstarttime : Date,
  tripeta : Date,
  triproutestart : String,
  triprouteend : String,
  cost : String,
  zones : {}, //tripZone
  tripstatus : {} //{tripStatus}
});

mongoose.model('Trip',tripSchema);
