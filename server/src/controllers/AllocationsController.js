var mongoose = require('mongoose')
var networksColl = mongoose.model('Network')
var driverDetails = mongoose.model('Drivers')
var tripLog = mongoose.model('Trip')
process.env.TZ = 'Asia/Kolkata'
const Graph = require('node-dijkstra')
const request = require("request")
//import child_process module
const child_process = require("child_process");
var _ = require('lodash')
API_KEY = 'AIzaSyDZsh4aEzGi9OXpFVjNGUoU190cJyZ5gV8'
var currentSysTime = (new Date).getTime()
driverSelectedForRoute = []
var allocJSON
// request("https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey={API_KEY}", function(err, res, body) {
//     if(!err && res.statusCode == 200) { // Successful response
//         console.log(body); // Displays the response from the API
//     } else {
//         console.log(err);
//     }
// });

// var sendJsonResponse = function(res,content){
//   // res.status(status);
//   res.json(content);
// };

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

module.exports.confirmAllocation = async function(req, res) {
  if (allocJSON){
  const tripLogSavedToDB = await addTripLog(allocJSON)  // Add to trip console.log();
  // save driver status in db
  tripLogSavedToDB.assignedRouteDrivers.forEach(async function(val) {
    // console.log(val)
    const saveDriverTripLog = await addDriverTripLog(allocJSON.tripid,val)
  })
  if (tripLogSavedToDB){
    res
      .status(200)
      .json('Trip Log added to DB ' + allocJSON.tripid);
    }
    allocJSON = ''
    tripid = ''
  } else {
    res
      .status(404)
      .json({
        "message": "No Allocation is requested"
      });
}
}

module.exports.getAllocations = async function(req, res,callback) {
    var allocId = req.params.allocationsId // .toString();
    var destination = req.params.destination
    var tripdate = currentSysTime + 12*3600*1000      //planning all trips 12 hrs from now.
    console.log(new Date(tripdate)) // Printing GMT Time
    var nodeCost = ''
    console.log('Route driver allocation between ' + allocId + ' and ' + destination )
    if (req.params && allocId && destination) {
      /*res.send({
        message: `Trying to pick up optimized route between` + allocId + ` and ` + destination
      })*/
      networksColl
        .find({})       // Apply filters here to speed up processing time
        .exec((err, network) => {
          if (err) {
            res
              .status(400)
              .json(err);
          } else {
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

            // Save trip id details
            var addTripId = new tripLog({
              tripid : currentSysTime               // Apply ID Generation Logic
            })

            // addTripId.save((err, task) => {
            //   if (err) {
            //     console.log(err)
            //   }
            //   // else {
            //   //    res
            //   //      .json({
            //   //         "message": "Added Trip ID"
            //   // })
            //   //   return tripid
            //   // }
            //   return addTripId
            // })
            // console.log(addTripId)
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
               // shortestFetchedRoute(selectedPath,addTripId,grabbedValue).then((driver) => {
               shortestFetchedRoute(selectedPath,addTripId,(fetchJSONValue,tripETA) => {
                 // Add more details to the allocJSON
                 allocJSON = {
                       tripid : currentSysTime,
                       tripStartTime : new Date(currentSysTime),
                       tripEndTime : new Date(tripETA),
                       assignedRouteDrivers : driverSelectedForRoute,
                       cost : '100',
                       zones : 'Yet to be fetched',
                       tripstatus : 'Dummy'
                     }
                 res
                   .status(200)
                   // .json(network);
                   .json(allocJSON)
                 driverSelectedForRoute = []// Remove array variable else it will be keep adding data
                 callback(allocJSON)
               })
               // .catch((e) => {
               //   console.log(e)
               // })
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
      const finalRouteTime = await getRouteTimeDistance(allocId, destination)
      console.log('Actual Travel Time ' + JSON.parse(finalRouteTime).rows[0].elements[0].duration.text + ' with additional buffer time and n hops')
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

const shortestFetchedRoute = async function(sRoute,sysTripId,callback) {
  // return new Promise((resolve,reject) => {
    var selectedRouteArray = []
    // var driverSelectedForRoute = []
    var user='Test'
    var oldCost = 1000
    var currentCost = 0
    var driverAllocated = ''
    var allocPhone = ''
    var lastSL = ''
    var isOrigin
    var tripStartEpochTime = currentSysTime
    var totalTravelTime = 0
    for (i=0;i < sRoute.length - 1;i++){
      const routeTime = await getRouteTimeDistance(sRoute[i],sRoute[i+1])
      selectedRouteArray.push(routeTime)
      var routeTimeJSON = JSON.parse(routeTime)
      // console.log(routeTimeJSON.rows[0].elements[0].duration.text)
      const setDriver = await fetchDriverOnPath(sRoute[i],sRoute[i+1])
      // console.log(_.find(setDriver,{"preferrednodes.isactive": true}))
      var driverSelectionArray = []
      driverAllocated = ''
      allocPhone = ''
      lastSL = ''
      oldCost = 1000
      setDriver.forEach(function(doc){
        //driver.forEach(function(doc){
             // console.log(doc.phone + " " + doc.drivername + " " + doc.preferrednodes)
             // activeRoutes = _.find(doc.preferrednodes,{'isactive': true})
             // console.log(activeRoutes)
             //console.log(_.orderBy(doc.preferrednodes,['cost'],['asc']))
             doc.preferrednodes.forEach(function(_doc){
                 if ((_doc.nodestart == sRoute[i] || _doc.nodestart == sRoute[i+1]) && (_doc.nodeend == sRoute[i] || _doc.nodeend == sRoute[i+1]) && _doc.isactive == true) {
               //   driverSelectionArray.push({
                    _id = doc._id,
                    name = doc.drivername,
                    phone = doc.phone,
                    cost = _doc.cost
                    lastSL = doc.lastservedlocation

                    // Fix to apply logic in case no results is returned.It is possible route exits but no driver exits or vice versa
                    // Currently if no next driver found old driver continues to remained assigned
               // })
             }
           })

           currentCost = cost
           if (currentCost <= oldCost){
             driverAllocated = name
             allocPhone = phone
           } else {
             // Do Nothing
           }
           oldCost = currentCost //Assigning new old cost

           //console.log(_.minBy(driverSelectionArray, 'cost'))
          // console.log(driverSelectionArray)
      })
      if (sRoute[i]){
        if (!isOrigin){
          tripStartEpochTime  = currentSysTime
          // console.log('Trip Start Time:'+ new Date(currentSysTime))
          isOrigin = 'Y'
        } else {
          // console.log(typeof(routeTimeJSON.rows[0].elements[0].duration.value))
          tripStartEpochTime = tripStartEpochTime + lastRouteTravelTime*1000 + 3600*1000
          // console.log(tripStartEpochTime)
          // console.log('Trip Start Time:'+ new Date(tripStartEpochTime)) //Start time + duration of travel + buffer time
        }
      // const finalRouteTime = await addTripLog(sysTripId.tripid,sRoute[i],sRoute[i+1],driverAllocated)

      var selectedDriver = {
        routeStart : sRoute[i],
        routeEnd : sRoute[i+1],
        driverAssigned : driverAllocated,
        startTime : new Date(tripStartEpochTime),
        endTime : new Date(tripStartEpochTime + routeTimeJSON.rows[0].elements[0].duration.value*1000),
        estimatedTravelTime : routeTimeJSON.rows[0].elements[0].duration.text,
        estimatedDistance : routeTimeJSON.rows[0].elements[0].distance.text
      }
      driverSelectedForRoute.push( selectedDriver )
      // console.log(sRoute[i] + " => Driver Assigned:"  + driverAllocated + " " + allocPhone + " " + lastSL)
      // console.log('Estimated Travel Time of '+routeTimeJSON.rows[0].elements[0].duration.text + " for " + routeTimeJSON.rows[0].elements[0].distance.text)
      lastRouteTravelTime = routeTimeJSON.rows[0].elements[0].duration.value
      totalTravelTime = totalTravelTime + lastRouteTravelTime
      driverAllocated = ''
      allocPhone = ''
      lastSL = ''
      oldCost = 1000
    }
  }
  thisTripEndTime = tripStartEpochTime + lastRouteTravelTime*1000
  console.log('Trip Schedule, Start at '+ new Date(currentSysTime) + 'Scheduled to arrive at ' + new Date(thisTripEndTime))
  callback(driverSelectedForRoute,thisTripEndTime)
}


const getRouteTimeDistance = (routeOrigin,routeDestination) => {
  return new Promise((resolve,reject) => {
    request("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+routeOrigin+",IN&destinations="+routeDestination+",IN&arrival_time="+currentSysTime+"&transit_mode=bus&key="+API_KEY, function(err, res, body) {
        if(!err && res.statusCode == 200) { // Successful response
            //console.log(JSON.parse(body)); // Displays the response from the API
            //console.log(body);
            resolve(body)
        } else {
            reject('Unable to get route details')
        }
        // Sleep for 5 seconds
        // child_process.execSync("sleep 5");
        // console.log('Custom Function')
    })
  })
}

const fetchDriverOnPath = (path,movingTo) => {
  return new Promise((resolve,reject) => {
    //var driver
    // if (movingTo){
    //     console.log(path + "-" + movingTo)
    //   }
  driverDetails
    //.find({"$and":[{lastservedlocation:shortestRoute.path[i]},{}]})

    .find({$and : [{lastservedlocation:path},{'preferrednodes.isactive':true}]}) //Very important select driver based on trip request date

    //db.drivers.find({"$and" : [{lastservedlocation:'Bhubaneswar'},{'preferrednodes.isactive':true}]}).sort({'preferrednodes.cost':1}).limit(1)
    //db.drivers.find({lastservedlocation:"Bhubaneswar",'preferrednodes.nodestart':"Bhubaneswar",'preferrednodes.isactive':true},{'preferrednodes.$':3}).sort({'preferrednodes.cost':1}).pretty();
    /* 1st Sep 2018
    .find({lastservedlocation:"Bhubaneswar"},{drivername:1,lastservedlocation:1,preferrednodes:1,preferrednodes:{$elemMatch:
                          {
                            nodeend:{"$in":["Bhubaneswar","Brahmapur"]},
                            nodestart:{"$in":["Bhubaneswar","Brahmapur"]},
                            isactive : "true"
                          }
                        }})//.pretty();

    //  this will return list of valid driver in the route.Apply rules to select one driver based on this result and pass it to output.
    //  */
    //.find({lastservedlocation:path},{drivername:1,phone:1,lastservedlocation:1,preferrednodes:{"$elemMatch":{nodeend:{"$in":[path,movingTo]},nodestart:{"$in":[path,movingTo]},isactive : false}}})
    /*
    db.drivers.aggregate(
       [
         { $match: {
           lastservedlocation:'Bhubaneswar'
         }},
         { $sort: { 'preferrednodes.cost':1 } },
         {$limit : 1}
       ]
    )
    */
    .exec((err, driver) => {
      if (err) {
        console.log('None Found')
      } else {
        //console.log(driver.preferrednodes.nodeend)
        // console.log('Found')
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
    }

    const addDriverTripLog = (tripid,driverFetched) => {
          return new Promise((resolve,reject) => {
            if (driverFetched) {
              driverDetails
                .findOne({drivername : driverFetched.driverAssigned})    //Enhance with actual driver id or something else
                .exec((err, driversTrip) => {
                  if (err) {
                    console.log('None Found')
                  } else {
                      driversTrip.isassigned = true,
                      driversTrip.triplogs.push({tripid : tripid,
                                              tripstarttime : driverFetched.startTime,
                                              tripendtime : driverFetched.endTime,
                                              routeStart : driverFetched.routeStart,
                                              routeEnd : driverFetched.routeEnd})
                      driversTrip.save((err, driverOutMsg) => {
                        if (err) {
                          reject(err)
                        } else {
                          resolve(driverOutMsg)
                        }
                      })
                  }
                })
        }
      })
    }

const addTripLog = (tripJSON) => {
      return new Promise((resolve,reject) => {
        if (tripJSON.tripid) {
          var newTripLog = new tripLog({
              tripid : tripJSON.tripid,
              assignedRouteDrivers : tripJSON.assignedRouteDrivers,
              tripstarttime : tripJSON.tripStartTime,
              tripeta : tripJSON.tripEndTime,
              cost : "100",
              zones : tripJSON.zones,
              tripstatus : tripJSON.tripstatus
          })
              newTripLog.save((err, outMsg) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(outMsg)
                }
              })
    }
  })
  }
