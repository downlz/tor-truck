var mongoose = require('mongoose')
var driNew = mongoose.model('Drivers')

  module.exports.newDrivers = async function(req, res) {
      var driversAdd = await new driNew({
        drivername : req.body.drivername,
        phone : req.body.phone,
        address : req.body.address,
        baselocation : req.body.baselocation,
        lastservedlocation : req.body.lastservedlocation,
        zones : req.body.zones,
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

    module.exports.addPreferredNodes = async function(req, res) {
      var driverid = req.params.driversId // .toString();
      if (driverid) {
        driNew
          .findOne({phone : driverid}) // . findById(networkid)
          .select('preferrednodes')
          .exec((err, drivers) => {
            if (err) {
              res
                .status(400)
                .json(err);
            } else {
              drivers.preferrednodes.push({
                nodestart : req.body.nodestart,
                nodeend : req.body.nodeend,
                distance : req.body.distance,
                cost : req.body.cost,
                isactive : req.body.isactive
              })
              drivers.save((err, nodeForDriver) => {
                if (err) {
                  res
                    .status(400)
                    .json(err);
                } else {
                   res
                     .status(201)
                     .json({
                        "message": "Add nodes to a driver " + driverid
                });
                }
              });
            }
          }
        );
      } else {
        res
          .status(404)
          .json({
            "message": "Not found, networkid required"
          });
      }
    };

    module.exports.getDriversDetails = async function(req,res){
      res.send({
        message: `Trying Driver between ${req.body.source} and ${req.body.destination} Allocations`
      })
    }
