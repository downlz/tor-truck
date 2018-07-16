module.exports = {
  register (req,res) {
      res.send({
        message: `Hello ${req.body.email} registerd`
      })
  },
  Allocations (req,res) {
      res.send({
        message: `Trying Driver between ${req.body.source} and ${req.body.destination} Allocations`
      })
  },
  AllocHistory (req,res) {
      res.send({
        message: `Shows all your recent transaction logs`
      })
  },
  Status (req,res) {
      res.send({
        message: `Shows status of our current`
      })
  }
}
