var mongoose = require('mongoose')
var regUser = mongoose.model('Register')
var driverDetails = mongoose.model('Drivers')

module.exports.register = async function(req, res) {
  var addUser = await new regUser({
    email: req.body.email,
    password: req.body.password
  })
  addUser.save(function(err, task) {
    if (err)
      res.status(400).send(err);
    res.json(task);
  })
}

module.exports.testDrivers = async function(req, res) {
  var node1 = "Source"
  var node2 = "Destination"
  dummyFunc(req, res, node1, node2)
}

const dummyFunc = function(req, res, network, driver) {
  // var node1 = "Source"
  // var node2 = "Destination"
  var driverId = "Test"
  var myArray = ["A", "B", "C", "D"]
  if (!network && !driver) {
    res
      .status(404)
      .json({
        "message": "networkid not found"
      });
  } else {
    res
      .status(201)
      .json({
        "message": "Success added nodes to a network" + " " + network + " " + driver
      });
  }
  intialElement = 0
  nextElement = 0
  for (i = 0; i < myArray.length; i++) {
    nextElement = nextElement + 1
    if (nextElement < myArray.length) {
      console.log("test" + myArray[nextElement])
    } else {
      console.log("End Reached.Relax")
    }
  }

  // Validate loops for data received from mongodb
  /*
        if (driverId) {
          driverDetails
            .find({drivername:'Driver1'}) // . findById(networkid)
            //.select('nodes')
            .exec((err, driverDtl) => {
              if (err) {
                res
                  .status(400)
                  .json(err);
              } else {
                res
                  .status(200)
                  .json(driverDtl);
                  driverDtl.each(function(doc) {
                    console.log(doc.drivername)
                  })
            }
          });
        } else {
          res
            .status(404)
            .json({
              "message": "Not found, valid phone no required"
            });
        }
    }
    //

     var resultArray = [];
    driverDetails.find({drivername:'Driver1'},function(err, driverDtl) {
          driverDtl.forEach(function(doc){
                  resultArray.push(doc.drivername);
              })
      })
      return resultArray
      console.log(resultArray) */
  if (driverId) {
    driverDetails
      .find({}) // . findById(networkid)
      .exec((err, driverDtl) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(driverDtl);
        }
      })
  }
}

module.exports.fetchDriverList = async function(req, res) {
  var driverId = req.params.driverId
  //var driverNode = []
  if (driverId) {
    driverDetails
      .find({ "$or":[(
        {lastservedlocation: driverId},{baselocation: driverId}
      )]
    }) // . findById(lastservedlocation)
      .exec((err, driverDtl) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(driverDtl)
          driverDtl.forEach(function(doc) {
            driverNode = doc.preferrednodes
            driverNode.forEach(function(subDoc) {
              console.log(subDoc.nodestart)
            })
                    })
        }
      })
  }
}
