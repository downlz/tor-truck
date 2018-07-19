var mongoose = require('mongoose')
var regUser = mongoose.model('Register')

module.exports.register = async function(req, res) {
    var addUser = await new regUser({
      email : req.body.email,
      password : req.body.password
    })
    addUser.save(function(err, task) {
      if (err)
        res.status(400).send(err);
      res.json(task);
    })
  }
