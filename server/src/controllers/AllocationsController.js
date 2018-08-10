var mongoose = require('mongoose')
var networksColl = mongoose.model('Network')
var _ = require('lodash')
const Graph = require('node-dijkstra')

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
  var nodeCost = ''
  //var mapStart
  if (req.params && allocId && destination) {
    /*res.send({
      message: `Trying to pick up optimized route between` + allocId + ` and ` + destination
    })*/
    networksColl
      .find({"$or":[{location:'Cuttack'},{location:'Kolkata'},{location:'Kharagpur'},{location:'Balasore'},{location:'Bhubaneswar'},{location:'Brahmapur'},{location:'Srikakulam'},{location:'Vizianagram'}]})
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
          //const route = new Graph(
          var nodeName = 'Node'
          var graph = new Map()
          network.forEach(function(doc) {
            // Using base approach
            /*
            nodeArray = doc.nodes
            nodeCost = JSON.stringify(doc.location) + " , " + "{ "
            nodeArray.forEach(function(subDoc) {
              //console.log(subDoc.nodename + " : " + subDoc.cost)
              nodeCost = nodeCost + JSON.stringify(subDoc.nodename) + " : " + subDoc.cost + ","
            })
            nodeCost = nodeCost.slice(0, -1) + " }"
            //nodeCost = nodeCost + " }"
            */
            var mapStart = doc.location
            //console.log('Starting Element ' + mapStart)
            // Using Graph layout
            // nodeLink = doc.location
            var mapStart = new Map()
            nodeArray = doc.nodes
            //nodeCost = nodeCost + JSON.stringify(doc.location) + " : " + "{ "
            nodeArray.forEach(function(subDoc) {
              //console.log(subDoc.nodename + " : " + subDoc.cost)
              //console.log(subDoc.nodename)
              //nodeCost = nodeCost + JSON.stringify(subDoc.nodename) + " : " + subDoc.cost + ","
              mapStart.set(subDoc.nodename, subDoc.cost)
            })
            //nodeCost = nodeCost.slice(0, -1) + " },"
            graph.set(doc.location, mapStart)

            //console.log(nodeCost)
            // route.addNode(nodeCost)
            /*route.addNode('B', { A:1, C:2, D: 4 })
            route.addNode('C', { B:2, D:1 })
            route.addNode('D', { C:1, B:4 })
            route.path('A', 'D') // => [ 'A', 'B', 'C', 'D' ]
          })
          if (typeof route.path(allocId,destination) != undefined){

          } else {
            console.log("Blocked")
          } */
          })
          //var obj = JSON.parse('{' + nodeCost + '}');
         //console.log(nodeCost)
         console.log('Trying to find route between:' + allocId + ' ' + destination)
         const route = new Graph(graph)
         var shortestRoute = route.path(allocId, destination,{cost:true})
         // console.log(shortestRoute.path)
         for (i=0;i<shortestRoute.path.length;i++)
          {
            // Find driver operating in current path

            // Pull drivers whose lastservedlocation is selected path and active is shortestRoute

            // For the fetched driver check if it matches the selected path and its end path equal
            // to next element of shortestRoute.While this check is being performed validate the critera
            // for reverse options also.
            // Get atleast one driver.If more than two drivers are found then chooose the one with low
            // cost.

            // Cost funtion will be different for network and driver.For NEtwork it will be pulled up from
            // Google Maps API
          }
          //const route = new Graph({
          //  "Balasore" : { "Cuttack" : 10 },"Bhubaneswar" : { "Brahmapur" : 10 },"Brahmapur" : { "Srikakulam" : 10 },"Cuttack" : { "Bhubaneswar" : 10 },"Kharagpur" : { "Balasore" : 10 },"Kolkata" : { "Murshidabad" : 10,"Kharagpur" : 10 },"Srikakulam" : { "Vizianagram" : 10 },"Visakhapatnam" : { },"Vizianagram" : { "Visakhapatnam" : 10 },
          //})
          // route.path(allocId,destination)
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

const getDriversForNodes = function(req, res, network) {


  if (!network) {
    res
      .status(404)
      .json({
        "message": "networkid not found"
      });
  } else {
    network.nodes.push({
      nodename: req.body.nodename,
      distance: req.body.distance,
      cost: req.body.cost,
      coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
    });
    network.save((err, network) => {
      if (err) {
        res
          .status(400)
          .json(err);
      } else {
        res
          .status(201)
          .json({
            "message": "Success added nodes to a network"
          });
      }
    });
  }
};
