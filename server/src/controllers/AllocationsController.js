module.exports = {
  register (req,res) {
      res.send({
        message: `Hello ${req.body.email} registerd`
      })
  },
  newAllocations (req,res) {
      res.send({
        message: `Trying Driver between ${req.body.source} and ${req.body.destination} Allocations`
      })
  },
  getAllocations (req,res) {
      res.send({
        message: `Find Details of drivers Allocations for a given route`
      })
  },
  ownerAllocHistory (req,res) {
      res.send({
        message: `Shows all your recent transaction logs for a selected owner`
      })
  },
  driverStatus (req,res){
    res.send({
      message: `Show the current driver status based on GPS`
    })
  }
}
