const allocationsController = require('./controllers/AllocationsController')
const driversController = require('./controllers/DriversController')
const authenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')
const registerController = require('./controllers/RegisterController')

module.exports = (app) =>{
  // Application Registration and login
  app.post('/register',authenticationControllerPolicy.register,registerController.register)
  // Allocation Details for a owner along a route
  app.post('/Allocations',allocationsController.newAllocations)
  app.get('/Allocations/:allocationsId',allocationsController.getAllocations)
  app.get('/Allocations/:ownerId/allocHistory',allocationsController.ownerAllocHistory)
  app.get('/Allocations/:allocationsId/drivers/:driverId/status',allocationsController.driverStatus)

  // Driver Route Requests
  app.get('/Drivers/:driverId',driversController.getDriversDetails)
  //app.post('/Drivers',authenticationControllerPolicy.newDrivers,driversController.newDrivers)
  app.post('/Drivers',driversController.newDrivers)

  // user List Routes
  // Improved Syntax
  /* app.route('/rooms')
    .get(room_list.list_all_rooms)
    .post(room_list.create_a_room);

  app.route('/rooms/:roomId')
    .get(room_list.read_a_room)
    .delete(room_list.delete_a_room); */
}
