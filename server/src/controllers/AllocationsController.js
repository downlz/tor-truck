var mongoose = require('mongoose')
var networksColl = mongoose.model('Network')
var driverDetails = mongoose.model('Drivers')
var _ = require('lodash')
const Graph = require('node-dijkstra')
const request = require("request");
// request("https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey={API_KEY}", function(err, res, body) {
//     if(!err && res.statusCode == 200) { // Successful response
//         console.log(body); // Displays the response from the API
//     } else {
//         console.log(err);
//     }
// });

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
    API_KEY = 'AIzaSyDZsh4aEzGi9OXpFVjNGUoU190cJyZ5gV8'
    //Testing Google Map Api

    request("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=Mumbai,IN&destinations=New+Delhi,IN&arrival_time=1534295980&transit_mode=bus&key="+API_KEY, function(err, res, body) {
        if(!err && res.statusCode == 200) { // Successful response
            //console.log(JSON.parse(body)); // Displays the response from the API
            console.log(body);
        } else {
            console.log(err);
        }
    });

    if (req.params && allocId && destination) {
      /*res.send({
        message: `Trying to pick up optimized route between` + allocId + ` and ` + destination
      })*/
      networksColl
        // .find({
        //   "$or": [{
        //       location: 'Cuttack'
        //     },
        //     {
        //       location: 'Kolkata'
        //     },
        //     {
        //       location: 'Kharagpur'
        //     },
        //     {
        //       location: 'Balasore'
        //     },
        //     {
        //       location: 'Bhubaneswar'
        //     },
        //     {
        //       location: 'Brahmapur'
        //     },
        //     {
        //       location: 'Srikakulam'
        //     },
        //     {
        //       location: 'Vizianagram'
        //     }
        //   ]
        // })
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
            var nodeName = 'Node'
            var graph = new Map()
            network.forEach(function(doc) {
              var mapStart = doc.location
              var mapStart = new Map()
              nodeArray = doc.nodes
              nodeArray.forEach(function(subDoc) {
                mapStart.set(subDoc.nodename, subDoc.cost)
              })
              graph.set(doc.location, mapStart)
            })
            //console.log('Trying to find route between:' + allocId + ' ' + destination)
            const route = new Graph(graph)
            var shortestRoute = route.path(allocId, destination, {
              cost: true
            })
            console.log('Fastest Route Found: ' + shortestRoute.path)
            var selectedPath = shortestRoute.path
            nextElement = 0
            // for (i=0;i<selectedPath.length;i++){
            //    nextElement = nextElement + 1
            //    if (nextElement < selectedPath.length) {
            //      // console.log("test" + selectedPath[nextElement])
            //    } else {
            //      // console.log("End Reached.Relax")
            //    }
               // Find driver operating in current path
               //var resultFetch = fetchDriverOnPath(selectedPath[i])
               //console.log(fetchDriverOnPath(selectedPath[i]))
               shortestFetchedRoute(selectedPath).then((driver) => {
                 console.log(driver);
               }).catch((e) => {
                 console.log(e)
               })
               // fetchDriverOnPath(selectedPath[i]).then((driver) => {
               //   console.log(driver)
               // }).catch((e) => {
               //   console.log(e)
               // })
               //console.log(resultFetch)
            // Pull drivers whose lastservedlocation is selected path and active is shortestRoute
            // For the fetched driver check if it matches the selected path and its end path equal
            // to next element of shortestRoute.While this check is being performed validate the critera
            // for reverse options also.
            // Get atleast one driver.If more than two drivers are found then chooose the one with low
            // cost.
            // Cost funtion will be different for network and driver.For NEtwork it will be pulled up from
            // Google Maps API
          //} //End of for loop
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

// const getDriverForPath = async (routeSelected) =>{
//   const setDriver = await fetchDriverOnPath(routeSelected)
//   setDriver.forEach(function(doc){
//     console.log(routeSelected + doc.phone + " " + doc.drivername + " " + doc.lastservedlocation)
//   })
// }

const shortestFetchedRoute = async (sRoute) => {
  //return new Promise((resolve,reject) => {
    var user='Test'
    for (i=0;i < sRoute.length;i++){
      const setDriver = await fetchDriverOnPath(sRoute[i])
      setDriver.forEach(function(doc){
        console.log(sRoute[i] + " => Driver Assigned:"  + doc.phone + " " + doc.drivername + " " + doc.lastservedlocation)
      })
    }
  //   if (user){
  //     resolve(user)
  //   } else {
  //     reject(user)
  //   }
  // })
}

const fetchDriverOnPath = (path) => {
  return new Promise((resolve,reject) => {
    //var driver
  driverDetails
    //.find({"$and":[{lastservedlocation:shortestRoute.path[i]},{}]})
    .find({"$and" : [{lastservedlocation:path},{'preferrednodes.isactive':'true'}]})
    .exec((err, driver) => {
      if (err) {
        console.log('None Found')
      } else {
        // console.log('Found')
        // driver.forEach(function(doc){
        //   console.log(doc.phone + " " + doc.drivername + " " + doc.lastservedlocation)
        // })
        if (driver){
          resolve(driver)
        } else {
          reject('Driver not found')
        }
        }
    })
  })
}


    var networkList = function(req, res, results) {
      console.log('networkList:');
      var networks = [];
      results.forEach(function(doc) {
        networks.push({
          location: doc.location.trim(),
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
          nodename: doc.nodename.trim(),
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
