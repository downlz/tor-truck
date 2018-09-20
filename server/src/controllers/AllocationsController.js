var mongoose = require('mongoose')
var networksColl = mongoose.model('Network')
var driverDetails = mongoose.model('Drivers')
var tripLog = mongoose.model('Trip')

const Graph = require('node-dijkstra')
const request = require("request")

// var moment = require('moment-timezone')
// moment.tz.setDefault("America/Los_Angeles")

//import child_process module
const child_process = require("child_process");
var _ = require('lodash')
var currentSysTime = (new Date).getTime() + 24*3600*1000
var maxTripTime = (new Date).getTime() + 7*24*3600*1000

var dateForOneDay = (new Date).getTime() + 6*24*3600*1000

// var currentSysTime = ''
driverSelectedForRoute = []
var driverAllocationComplete = true
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
  if (tripLogSavedToDB.tripstatus.isconfirmed == true){
  tripLogSavedToDB.assignedRouteDrivers.forEach(async function(val) {
    // console.log(val)
    const saveDriverTripLog = await addDriverTripLog(allocJSON.tripid,val)
  })

  if (tripLogSavedToDB){
    console.log("Trip Log saved")
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
res
  .status(200)
  .json('Trip Logs added to DB');
}
}

module.exports.getAllocations = async function(req, res,callback) {

    // if (!start && !end && !tdate){
    var allocId = req.params.allocationsId // .toString();
    var destination = req.params.destination
    var tripdate = req.params.tripdate
    // } else {
    // var allocId = start
    // var destination = end
    // var tripdate = tdate
    // }

    var currentSysTime = tripdate * 1000 // overriding current time with user time
    // var tripdate = currentSysTime + 24*3600*1000      //planning all trips 12 hrs from now.
    // console.log(new Date(tripdate)) // Printing GMT Time
    var nodeCost = ''
    console.log('Route driver allocation between ' + allocId + ' and ' + destination )
    if (req.params && allocId && destination && (new Date(currentSysTime) > (new Date).getTime()) && (new Date(currentSysTime) < (new Date(maxTripTime)))) {
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

            var selectedPath = shortestRoute.path
            var pathFound = true
            if (selectedPath == null){
              var pathFound = false
              const routeRev = new Graph(graph)
              var shortestRouteRev = routeRev.path(destination, allocId, {
                cost: true
              })
              if (shortestRouteRev.path == null){
                var pathFound = false
              } else {
              var selectedPath = shortestRouteRev.path
              _.reverse(selectedPath)
              var pathFound = true
            }
            }
            //   else if (shortestRouteRev == null){
            //     // Some garbage message goes here if required
            //     res
            //       .status(200)
            //       .json({
            //         "message": "No connected route found in request"
            //       });
            // }
            if (pathFound == true){
            console.log('Fastest Route Found: ' + selectedPath)
            // Save trip id details
            tripid = _.upperCase(allocId.substring(0, 3)) + _.upperCase(destination.substring(0, 3)) + tripdate
            var addTripId = new tripLog({
              tripid : _.upperCase(allocId.substring(0, 3)) + _.upperCase(destination.substring(0, 3)) + tripdate             // Apply ID Generation Logic
            })

            nextElement = 0
               shortestFetchedRoute(selectedPath,addTripId,currentSysTime,(fetchJSONValue,tripETA) => {
                 // Add more details to the allocJSON
                 allocJSON = {
                       tripid : tripid,
                       tripStartTime : new Date(currentSysTime),
                       tripEndTime : new Date(tripETA),
                       tripOrigin : allocId,
                       tripDestination : destination,
                       assignedRouteDrivers : driverSelectedForRoute,
                       cost : '100',
                       zones : 'TBD',
                       tripstatus : 'Dummy',
                       driverAllocated : driverAllocationComplete     // to be used to raise a flag
                     }
                 res
                   .status(200)
                   // .json(network);
                   .json(allocJSON)
                 driverSelectedForRoute = []// Remove array variable else it will be keep adding data
                 driverAllocationComplete = true
                 callback(allocJSON)
               })
             } else {
                   res
                     .status(200)
                     .json({
                       "message": "No connected route found in request"
                     })
             }
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
      const finalRouteTime = await getRouteTimeDistance(allocId, destination,currentSysTime)
      console.log('Actual Travel Time ' + JSON.parse(finalRouteTime).rows[0].elements[0].duration.text + ' with additional buffer time and n hops')
    }

  else {
      res
        .status(404)
        .json({
          "message": "No locationid in request or time has already passed or you choose a very large future date"
        });
    }
}

// const getDriverForPath = async (routeSelected) =>{
//   const setDriver = await fetchDriverOnPath(routeSelected)
//   setDriver.forEach(function(doc){
//     console.log(routeSelected + doc.phone + " " + doc.drivername + " " + doc.lastservedlocation)
//   })
// }

const shortestFetchedRoute = async function(sRoute,sysTripId,tripDate,callback) {
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
    var tripStartEpochTime = tripDate
    var totalTravelTime = 0
    // var driverAllocationComplete = true
    for (i=0;i < sRoute.length - 1;i++){
      const routeTime = await getRouteTimeDistance(sRoute[i],sRoute[i+1],tripDate)
      selectedRouteArray.push(routeTime)
      var routeTimeJSON = JSON.parse(routeTime)
      // console.log(routeTimeJSON.rows[0].elements[0].duration.text)
      const setDriver = await fetchDriverOnPath(sRoute[i],sRoute[i+1],tripDate)
      // console.log(_.find(setDriver,{"preferrednodes.isactive": true}))
      // console.log(setDriver);
      var driverSelectionArray = []
      driverAllocated = ''
      allocPhone = ''
      lastSL = ''
      oldCost = 1000
      gotDriverForNode = false
      driverKount = 0
      setDriver.forEach(function(doc){
        //driver.forEach(function(doc){
             // console.log(doc.phone + " " + doc.drivername + " " + doc.preferrednodes)
             // activeRoutes = _.find(doc.preferrednodes,{'isactive': true})
             // console.log(activeRoutes)
             //console.log(_.orderBy(doc.preferrednodes,['cost'],['asc']))

             doc.preferrednodes.forEach(function(_doc){
               // console.log(sRoute[i] + " " + sRoute[i+1])
                 if ((_doc.nodestart == sRoute[i] || _doc.nodestart == sRoute[i+1]) && (_doc.nodeend == sRoute[i] || _doc.nodeend == sRoute[i+1]) && _doc.isactive == true) {
               //   driverSelectionArray.push({
                    _id = doc._id
                    name = doc.drivername
                    phone = doc.phone
                    cost = _doc.cost
                    lastSL = doc.lastservedlocation
                    gotDriverForNode = true
               // })
             } else {     // Fix to apply logic in case no results is returned.It is possible route exits but no driver exits or vice versa
                    // name = ''       // Currently if no next driver found old driver continues to remained assigned
                    // phone = ''      // Create need for additional driver log
                    // driverAllocationComplete = false //Flag for manual review
             }
           })
           if (gotDriverForNode == false) {
                 name = ''
                 phone = ''
           }
           currentCost = cost
           if (currentCost <= oldCost){
             driverAllocated = name
             allocPhone = phone
           } else {
             // Needs manual intervention as assigned old drivers may create conflict based on preferred nodes
             // driverAllocated = ''
             // allocPhone = ''
           }
           oldCost = currentCost //Assigning new old cost

           //console.log(_.minBy(driverSelectionArray, 'cost'))
          // console.log(driverSelectionArray)
      })
      if (sRoute[i]){
        if (!isOrigin){
          tripStartEpochTime  = tripDate
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
      if (driverAllocated == ''){
        driverAllocationComplete = false
      }
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
  console.log('Trip Schedule, Start at '+ new Date(tripDate) + 'Scheduled to arrive at ' + new Date(thisTripEndTime))
  callback(driverSelectedForRoute,thisTripEndTime)
}


const getRouteTimeDistance = (routeOrigin,routeDestination,tripDate) => {
  return new Promise((resolve,reject) => {
    request("https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+routeOrigin+",IN&destinations="+routeDestination+",IN&arrival_time="+tripDate+"&transit_mode=bus&key="+process.env.API_KEY, function(err, res, body) {
        if(!err && res.statusCode == 200) { // Successful response.Date passes in above API is in GMT zone.
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

const fetchDriverOnPath = (path,movingTo,tripDate) => {
  return new Promise((resolve,reject) => {
    //var driver
    // if (movingTo){
    //     console.log(path + "-" + movingTo)
    //   }
    // var tripdate = currentSysTime + 24*3600*1000 // Find a better solution to this
  driverDetails
    //.find({"$and":[{lastservedlocation:shortestRoute.path[i]},{}]})

    .find({$and : [{lastservedlocation:path},{'preferrednodes.isactive':true},{lastservedason :{ $lt : new Date(tripDate)}}]}) //Very important select driver based on trip request date

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
                    if (driversTrip){
                      driversTrip.isassigned = true,                    // Finding no significance now
                      driversTrip.lastservedlocation = driverFetched.routeEnd
                      driversTrip.lastservedason = driverFetched.endTime
                      driversTrip.triplogs.push({tripid : tripid,
                                              tripstarttime : driverFetched.startTime,
                                              tripendtime : driverFetched.endTime,
                                              routestart : driverFetched.routeStart,
                                              routeend : driverFetched.routeEnd})
                      driversTrip.save((err, driverOutMsg) => {
                        if (err) {
                          reject(err)
                        } else {
                          resolve(driverOutMsg)
                        }
                      })
                  }
                }
                })
        }
      })
    }

const addTripLog = (tripJSON) => {
      return new Promise((resolve,reject) => {
        var sTime = new Date(tripJSON.tripStartTime)
        var myEpoch = sTime.getTime()/1000
        var currTime = (new Date).getTime()/1000
        if ((myEpoch - currTime)/3600 > 24){
            isconfirmed = false
            confirmedon = ''
        } else {
            isconfirmed = true
            confirmedon = + new Date()
        }
        if (tripJSON.tripid) {
          var thisTripStatus = {
              requestedon : new Date(+ new Date()),
              isconfirmed : isconfirmed,
              confirmedon : new Date(confirmedon),          // To trace at what time this was confirmed.
              isontrip : false,
              currentlocation : '',
              lastKnownlocation : '',
              currentassigneddriver : '',
              nextassigneddriver : '',
              previousassigneddriver : '',
              eta : ''
          }
          tripLog
            .findOne({tripid : tripJSON.tripid}) // . findById(networkid)
            //.select('nodes')
            .exec((err, newTripLog) => {
              if (err) {
                console.log("Unable to save")
              }

            if (newTripLog){                                                   // Poor Code standards
              newTripLog.assignedRouteDrivers = tripJSON.assignedRouteDrivers,
              newTripLog.tripstarttime = tripJSON.tripStartTime,
              newTripLog.tripeta = tripJSON.tripEndTime,
              newTripLog.triproutestart = tripJSON.tripOrigin,
              newTripLog.triprouteend = tripJSON.tripDestination,
              newTripLog.cost = "100",                   // To be calculated later
              newTripLog.zones = tripJSON.zones,
              newTripLog.tripstatus = thisTripStatus
              // console.log("I am here")
            } else {

          var newTripLog = new tripLog({
              tripid : tripJSON.tripid,
              assignedRouteDrivers : tripJSON.assignedRouteDrivers,
              tripstarttime : tripJSON.tripStartTime,
              tripeta : tripJSON.tripEndTime,
              triproutestart : tripJSON.tripOrigin,
              triprouteend : tripJSON.tripDestination,
              cost : "100",                   // To be calculated later
              zones : tripJSON.zones,
              tripstatus : thisTripStatus
          })
        }
              newTripLog.save((err, outMsg) => {
                if (err) {
                  reject(err)
                } else {
                  console.log("Trip Log Saved")
                  resolve(outMsg)
                }
              })
            })
    }
  })
  }

  // Job Schedule to for tentative scheuling

  module.exports.tripConfirmJob = async function(req, res) {
    tripLog
    .findOne({$and : [{tripstarttime :{ $lt : new Date(dateForOneDay)}},{'tripstatus.isconfirmed':false}]}) //Very important select driver based on trip request date
    .exec((err, tripConfirm) => {
      if (err) {
        console.log('No trips for confirmation found.Relaxxx')
      } else {
        if (tripConfirm){
          tripConfirmIDs(tripConfirm)
          res
            .status(200)
            .json(tripConfirm)
        }
      }
    })
  }

  const tripConfirmIDs = async function(idsToConfirm) {

      var allocId = idsToConfirm.triproutestart
      var destination = idsToConfirm.triprouteend
      var tripSDate = new Date(idsToConfirm.tripstarttime) // Your timezone!
      var tripEpoch = tripSDate.getTime()/1000.0
      const allocatedRoutePlan = await callAllocationAPI(allocId, destination,tripEpoch)
      var allocJSONToSave = JSON.parse(allocatedRoutePlan)
      // //console.log(allocJSONToSave)
      if (allocJSONToSave && allocJSONToSave != 'ERROR'){
      //   console.log("inner block")
      const tripLogSavedToDB = await addTripLog(allocJSONToSave)  // Add to trip console.log();
      console.log(tripLogSavedToDB.tripid)
      if (tripLogSavedToDB.tripstatus.isconfirmed == true){
      tripLogSavedToDB.assignedRouteDrivers.forEach(async function(val) {
        const saveDriverTripLog = await addDriverTripLog(allocJSONToSave.tripid,val)
        // console.log(allocJSONToSave.tripid)
      })
        if (tripLogSavedToDB){
          console.log("Trip Log saved for driver")
        } else {
          res
            .status(404)
            .json({
              "message": "No Allocation is requested"
            })
      }
    }
    }
    }

  var callAllocationAPI = (routeOrigin,routeDestination,tripDatePlan) => {
  return new Promise((resolve,reject) => {
  request("http://localhost:8081/Allocations/"+routeOrigin+"/destination/"+routeDestination+"/tripdate/"+tripDatePlan, function(err, res, body) {
      if(!err && res.statusCode == 200) { // Successful response.Date passes in above API is in GMT zone.
          resolve (body)
      } else {
          reject('ERROR')      // Catch error if API trip date already passed.
      }
  })
})
}
