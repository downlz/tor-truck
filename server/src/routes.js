const allocationsController = require('./controllers/AllocationsController')
const driversController = require('./controllers/DriversController')
const operatorController = require('./controllers/OperatorConstroller')
const authenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const registerController = require('./controllers/RegisterController')
const networkController = require('./controllers/NetworkController')
const tripController = require('./controllers/TripController')

module.exports = (app) =>{
  // Application Registration and login
  //app.post('/register',authenticationControllerPolicy.register,registerController.register)
  // Allocation Details for a owner along a route
  app.post('/Allocations',allocationsController.newAllocations)
  //app.put('/Allocations/:allocationsId',allocationsController.allocationsUpdate)
  app.get('/Allocations/:allocationsId/destination/:destination/tripdate/:tripdate',allocationsController.getAllocations)
  app.get('/Allocations/:allocationsId/destination/:destination/confirm/:isConfirm',allocationsController.confirmAllocation)
  app.get('/Allocations/:ownerId/allocHistory',allocationsController.ownerAllocHistory)
  app.get('/Allocations/:allocationsId/drivers/:driverId/status',allocationsController.driverStatus)
  app.get('/Allocations/tripConfirmJob',allocationsController.tripConfirmJob)
  app.get('/Canceltrip/:allocationsId',allocationsController.cancelTrip)

  app.get('/Trip/:tripid/status/:stat',tripController.tripStatus)
  app.get('/Trip/:tripid/finish',tripController.tripComplete)

  // Driver Route Requests
  app.get('/Drivers/:driversId',driversController.getDriversDetails)
  //app.post('/Drivers',authenticationCo;ntrollerPolicy.newDrivers,driversController.newDrivers)
  app.post('/Drivers',driversController.newDrivers)
  app.post('/Drivers/:driversId/preferrednodes',driversController.addPreferredNodes)
  app.put('/Drivers/:driversId',driversController.updDrivers)

  // Add Nodes in a network
  app.post('/Network',networkController.addNetwork)
  app.post('/Network/:networkId/nodes',networkController.addNodes)
  app.put('/Network/:networkId',networkController.updNetwork)
  app.put('/Network/:networkId/nodes/:nodesId',networkController.updNodes)

  app.get('/register/:driverId',registerController.fetchDriverList)

  // Operator Route Requests
  app.get('/Operator/:operatorId',operatorController.getOperatorDetails)
  app.get('/Operator/:operatorId/fleet/:fleetId',operatorController.getFleetStatus)
  app.post('/Operator',operatorController.newOperator)
  app.post('/Operator/:operatorId/addfleet',operatorController.addFleet)
  app.put('/Operator/:operatorId',operatorController.updOperator)

  // user List Routes
  // Improved Syntax
  /* app.route('/rooms')
    .get(room_list.list_all_rooms)
    .post(room_list.create_a_room);

  app.route('/rooms/:roomId')
    .get(room_list.read_a_room)
    .delete(room_list.delete_a_room); */
}
