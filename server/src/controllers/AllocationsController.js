var mongoose = require('mongoose')
var networksColl = mongoose.model('Network')
var _ = require('lodash')

module.exports = {
  register(req, res) {
    res.send({
      message: `Hello ${req.body.email} registerd`
    })
  },
  newAllocations(req, res) {
    res.send({
      message: `Trying Driver between ${req.body.source} and ${req.body.destination} Allocations`
    })
  },
  ownerAllocHistory(req, res) {
    res.send({
      message: `Shows all your recent transaction logs for a selected owner`
    })
  },
  driverStatus(req, res) {
    res.send({
      message: `Show the current driver status based on GPS`
    })
  }
}

module.exports.getAllocations = async function(req, res) {
  var allocId = req.params.allocationsId // .toString();
  var destination = req.params.destination
  if (req.params && allocId && destination) {
    /*res.send({
      message: `Trying to pick up optimized route between` + allocId + ` and ` + destination
    })*/
    networksColl
      .find({})
      .exec((err, network) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          res
            .status(200)
            .json(network);
          /* _.forEach(network, function(location, key) {
            console.log(key);
          }); */
          var nodes = _.find(network,['location','Mumbai']).nodes
          console.log(_.find(nodes,['nodename','Pune']).cost)
        }
      })
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid in request"
      });
  }
}
