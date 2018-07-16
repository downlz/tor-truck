var sendJsonResponse = function(res,status,content){
  res.status(status)
  res.json(content)
}
module.exports = {
  Drivers (req,res) {
      // res.send({
      //  message: `Welcome to drivers dashboard`
      // })
      sendJsonResponse(res, 200 ,{"status" : "success"})
  }
}

// app.get('/test',(req,res) => {
//  res.send({
//    message : "Hello World"
//  })
// })
