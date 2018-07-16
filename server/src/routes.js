const AuthenticationController = require('./controllers/AllocationsController')
const DriversController = require('./controllers/DriversController')

module.exports = (app) =>{
  app.post('/register',AuthenticationController.register)
  app.post('/Allocations',AuthenticationController.Allocations)
  app.post('/Allocations/AllocHistory',AuthenticationController.AllocHistory)
  app.post('/Allocations/Driver/Status',AuthenticationController.Status)
  app.get('/Drivers/:Drivers',DriversController.Drivers)
}
