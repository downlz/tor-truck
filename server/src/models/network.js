/* eslint-disable */
var mongoose = require( 'mongoose' );
var openingTimeSchema = new mongoose.Schema ({
  days : {type : String,required : false},
  opening : String,
  closing : String,
  closed : {type : Boolean, required : false}
});

var networkNodesSchema = new mongoose.Schema ({
  nodename : {type : String},    // Should be true,test purpose only
  distance :  {type : Number,min : 0,max : 5000},
  cost : {type : Number},         // Should be true,test purpose only
  coords : {type : [Number], index : '2dsphere'},
  createdOn : {type : Date,"default" : Date.now}
});

var networkPointSchema = new mongoose.Schema ({
  location : {type : String,required : true},
  services : [String],
  address : String,
  loc_type : [String],
  coords : {type : [Number], index : '2dsphere',required : false},
  openingTimes : [openingTimeSchema],
  nodes : [networkNodesSchema],
  createdOn : {type : Date,"default" : Date.now}
});

mongoose.model('Network',networkPointSchema);
