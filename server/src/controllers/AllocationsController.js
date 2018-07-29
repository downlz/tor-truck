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
      .find({
        location: allocId
      })
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
          // var nodes = _.find(network,['location','Mumbai'])//.nodes
          // console.log(_.find(nodes,['nodename','Pune']).cost)
          // for (var address in network) {
          //  console.log(address + ": " + network[address]);
          //  }
          //networkpoints = networkList(req,res,network)
          network.forEach(function(doc) {
            nodeArray = doc.nodes
            nodeCost = doc.location + " , " + "{ "
            nodeArray.forEach(function(subDoc) {
              //console.log(subDoc.nodename + " : " + subDoc.cost)
              nodeCost = nodeCost + subDoc.nodename + " : " + subDoc.cost + ","
            })
            nodeCost = nodeCost.slice(0, -1) + " }"
            //nodeCost = nodeCost + " }"
            console.log(nodeCost)
            /* route.addNode('A', { B:1 })
            route.addNode('B', { A:1, C:2, D: 4 })
            route.addNode('C', { B:2, D:1 })
            route.addNode('D', { C:1, B:4 })
            route.path('A', 'D') // => [ 'A', 'B', 'C', 'D' ] */
          })
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

var networkList = function(req, res, results) {
  console.log('networkList:');
  var networks = [];
  results.forEach(function(doc) {
    networks.push({
      location: doc.location,
      services: doc.services,
      address: doc.address,
      nodes: doc.nodes(),
      // cost: doc.nodes.cost,
      _id: doc._id
    });
  });
  return networks;
};

var nodeList = function(req, res, results) {
  console.log('nodeList:');
  var nodes = [];
  results.forEach(function(doc) {
    nodes.push({
      nodename: doc.nodename,
      distance: doc.distance,
      cost: doc.cost,
      // nodes: doc.nodes.nodename,
      // cost: doc.nodes.cost,
      _id: doc._id
    });
  });
  return nodes;
};
