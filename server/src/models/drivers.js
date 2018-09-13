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
  nodestart : {type : String,required : true,index: true},
  nodeend : {type : String,required : true,index: true},
  distance : {type : Number,required : true},
  cost: {type : Number},
  isactive : {type : Boolean, required : true}
})
// preferredNodes.index({nodestart: 1, nodeend: 1,type: -1})

var driverStatus = new mongoose.Schema ({
  isonactivetrip : {type : Boolean, "default" : false},
  lasttripstarttime : Date,
  lasttripendtime : Date,
  lastservedlocation : String,
  currenttripstarttime : Date,
  currenttripendtime : Date,
  tripid : String,           // Attach to triplog
  nextshift : Date,
  currentlocation : {type : String},      // Update in realtime
  nextplannedroute : {}
})

var driverTripLog = new mongoose.Schema ({
  tripid : String,
  tripstarttime : Date,
  tripendtime : Date,
  routestart : String,
  routeend : String
})

var driverSchema = new mongoose.Schema ({
  drivername : {type : String,required : true},
  phone : {type : String,unique : true},
  address : String,
  baselocation : {type : String,required : true},
  lastservedlocation : {type : String},           // To be updated once driver completes his trip, can also be updated based on trip allocation
  zones : [ String ],
  preferrednodes : [preferredNodes],
  workTimes : workTimeSchema,
  driverStatus : {driverStatus},
  isassigned : {type : Boolean, "default" : false,required : true },
  triplogs : [driverTripLog]            // Pull user details from triplog
})
//driverSchema.index({phone: 1, preferrednodes.nodestart: 1,'preferrednodes.nodeend': 1}, {unique: true})

mongoose.model('Drivers',driverSchema);
