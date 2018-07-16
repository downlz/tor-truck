/* eslint-disable */
var mongoose = require( 'mongoose' );
var openingTimeSchema = new mongoose.Schema ({
  days : {type : String,required : false},
  opening : String,
  closing : String,
  closed : {type : Boolean, required : false}
});

var networkNodesSchema = new mongoose.Schema ({
  nodename : {type : String,required : true},
  distance :  {type : Number,required : true,min : 0,max : 500},
  cost : {type : Number,required : true},
  coords : {type : [Number], index : '2dsphere',required : false},
  createOn : {type : Date,"default" : Date.now}
});

var networkPointSchema = new mongoose.Schema ({
  location : {type : String,required : true},
  services : [String],
  address : String,
  loc_type : [String],
  coords : {type : [Number], index : '2dsphere',required : false},
  openingTimes : [openingTimeSchema],
  nodes : [networkNodesSchema]
});

mongoose.model('Network',networkPointSchema);
