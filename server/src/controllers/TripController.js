var mongoose = require('mongoose')
var tripLog = mongoose.model('Trip')

module.exports.tripStatus = async function(req, res) {
  val = req.params.stat
  console.log(process.env.API_KEY)
  res.send({
    message: `Shows tripSatus` + val
  })
}

module.exports.tripComplete = async function(req, res) {
  res.send({
    message: `Marks trip to complete`
  })
  // Based on tripeta mark trip request as complete.
  // Release driver assigned so that they can be assigned to other routes.
}
