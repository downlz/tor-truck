var mongoose = require('mongoose')
var driNew = mongoose.model('Drivers')

/*var sendJsonResponse = function(res,status,content){
  res.status(status)
  res.json(content)
}*/
module.exports.getDriversDetails = function (req,res){
      sendJsonResponse(res, 200 ,{"status" : "success for sample API"})
}

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
      driversAdd.save((err, task) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
           res
             .status(201)
             .json({
                "message": "Success added driver added to system"
        });
        }
      });
    }

    module.exports.updDrivers = async function(req, res) {
      var driverId = req.params.driversId // .toString();
      if (driverId) {
        driNew
          .findOne({phone : driverId}) // . findById(networkid)
          //.select('nodes')
          .exec((err, driver) => {
            if (err) {
              res
                .status(400)
                .json(err);
            }
            driver.address = req.body.address,
            driver.baselocation = req.body.baselocation,
            driver.lastservedlocation = req.body.lastservedlocation,
            driver.zones = req.body.zones.split(","),
            driver.preferrednodes = req.body.preferrednodes.split(","),
            driver.workTimes = req.body.workTimes
            driver.save((err, driver) => {
              if (err) {
                res
                  .status(400)
                  .json(err);
              } else {
                 res
                   .status(201)
                   .json({
                      "message": "Updated Drivers details" + driverId
              });
              }
            });
          }
        );
      } else {
        res
          .status(404)
          .json({
            "message": "Not found, valid phone no required"
          });
      }
    };
