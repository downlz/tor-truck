/* eslint-disable */
var mongoose = require( 'mongoose' );

var fleetdetails = new mongoose.Schema ({
  vehicleno : String,
  vehicletype : String,
  baselocation : String,
  permit : String,      //National or State
  currentlocation : String,
  lastservedlocation : String,
  lastservedason : {type : Date,default: +new Date()}
})

var operatorSchema = new mongoose.Schema ({
  orgname : {type : String},
  phone : {type : String},
  address : String,
  email : String,
  operatingzone : [String],
  fleetdetails : [fleetdetails]
})
//driverSchema.index({phone: 1, preferrednodes.nodestart: 1,'preferrednodes.nodeend': 1}, {unique: true})

mongoose.model('fleetOperator',operatorSchema);
