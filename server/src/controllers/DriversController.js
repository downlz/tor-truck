var mongoose = require('mongoose')
var driNew = mongoose.model('Drivers')

/*var sendJsonResponse = function(res,status,content){
  res.status(status)
  res.json(content)
}*/
module.exports.getDriversDetails = function (req,res){
      sendJsonResponse(res, 200 ,{"status" : "success for sample API"})
}
/*
module.exports.newDrivers = function (req,res) {

      driNew.create({
        drivername : req.body.drivername,
        phone : req.body.phone,
        address : req.body.address,
        baselocation : req.body.baselocation,
        lastservedlocation : req.body.lastservedlocation,
        zones : req.body.zones,
        preferrednodes : req.body.preferrednodes,
        workTimes : req.body.workTimes
      }, function(err,driversAdd){
        if (err) {
            sendJsonResponse(res, 400 ,err)
        } else {
            sendJsonResponse(res, 200 ,driversAdd)
        }
      })
  } */

  module.exports.newDrivers = async function(req, res) {
      var driversAdd = await new driNew({
        drivername : req.body.drivername,
        phone : req.body.phone,
        address : req.body.address,
        baselocation : req.body.baselocation,
        lastservedlocation : req.body.lastservedlocation,
        zones : req.body.zones,
        preferrednodes : req.body.preferrednodes.split(","),
        workTimes : req.body.workTimes
      }) //req.body);
      driversAdd.save(function(err, task) {
        if (err)
          res.status(400).send(err);
        res.json(task);
      })
    }
// app.get('/test',(req,res) => {
//  res.send({
//    message : "Hello World"
//  })
// })
