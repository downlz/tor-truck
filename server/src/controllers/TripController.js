var mongoose = require('mongoose')
var tripLog = mongoose.model('Trip')

module.exports.tripStatus = async function(req, res) {
  val = req.params.stat
  res.send({
    message: `Shows tripSatus ` + new Date()
  })
}

module.exports.tripComplete = async function(req, res) {
  res.send({
    message: `Shows tripSatus Complete`
  })
}
