var mongoose = require('mongoose')
var fleetOperator = mongoose.model('fleetOperator')

  module.exports.newOperator = async function(req, res) {
      var operatorAdd = await new fleetOperator({
        orgname : req.body.orgname,
        phone : req.body.phone,
        address : req.body.address,
        email : req.body.email,
        operatingzone : req.body.operatingzone
      }) //req.body);
      operatorAdd.save((err, task) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
           res
             .status(201)
             .json({
                "message": "Successfully added operator : " + req.body.orgname
        });
        }
      });
    }

    module.exports.updOperator = async function(req, res) {
      var operatorId = req.params.operatorId // .toString();
      if (operatorId) {
        fleetOperator
          .findOne({phone : operatorId}) // . findById(networkid)
          //.select('nodes')
          .exec((err, operator) => {
            if (err) {
              res
                .status(400)
                .json(err);
            }
            operator.address = req.body.address,
            operator.orgname = req.body.orgname,
            operator.email = req.body.email,
            operator.operatingzone = req.body.operatingzone
            operator.save((err, operator) => {
              if (err) {
                res
                  .status(400)
                  .json(err);
              } else {
                 res
                   .status(201)
                   .json({
                      "message": "Updated Operator details" + operatorId
              });
              }
            });
          }
        );
      } else {
        res
          .status(404)
          .json({
            "message": "No operator found, valid phone no required"
          });
      }
    };

    module.exports.addFleet = async function(req, res) {
      existingFleetFound = false
      var operatorId = req.params.operatorId // .toString();
      if (operatorId) {
        fleetOperator
          .findOne({phone : operatorId}) // . findById(networkid)
          .select('fleetdetails')
          .exec((err, operator) => {
            if (err) {
              res
                .status(400)
                .json(err);
            } else {
              operator.fleetdetails.forEach(function(doc) {
                  if (doc.vehicleno == req.body.vehicleno){
                      existingFleetFound = true
                  }
              })
              if (existingFleetFound == false){
              operator.fleetdetails.push({
                vehicleno : req.body.vehicleno,
                vehicletype : req.body.vehicletype,
                baselocation : req.body.baselocation,
                permit : req.body.permit,
                currentlocation : req.body.currentlocation,
                lastservedlocation : req.body.currentlocation
              })
              operator.save((err, addFleetDtl) => {
                if (err) {
                  res
                    .status(400)
                    .json(err);
                } else {
                   res
                     .status(201)
                     .json({
                        "message": "Added vehicle for operator " + operatorId
                });
                }
              });
            } else {
              res
                .status(201)
                .json({
                   "message": "Already exists"
           });
            }
            }
          }
        );
      } else {
        res
          .status(404)
          .json({
            "message": "Not found, operator id is required"
          });
      }
    };

    module.exports.getOperatorDetails = async function(req,res){
      var operatorId = req.params.operatorId
      if (operatorId) {
        fleetOperator
          .findOne({phone : operatorId})
          .exec((err, operator) => {
              if (err || operator == null){
                res
                  .status(404)
                  .json({
                    "message": "No Operator found"
                  })
              } else {
                res
                  .status(200)
                  .json({operator})
              }
          })
        }
    }

    module.exports.getFleetStatus = async function(req,res){
      var operatorId = req.params.operatorId
      var vehicleno = req.params.fleetId
      if (operatorId) {
        fleetOperator
          .find({"fleetdetails.vehicleno" : vehicleno},{'fleetdetails.$':1})
          .exec((err, operator) => {
              if (err || operator == null){
                res
                  .status(404)
                  .json({
                    "message": "No Vehicle found"
                  })
              } else {
                res
                  .status(200)
                  .json({operator})
              }
          })
        }
    }
