var mongoose = require('mongoose')
var addNewNetwork = mongoose.model('Network')

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.addNetwork = async function(req, res) {
  var addNetworkPoint = await new addNewNetwork({
    location: req.body.location,
    services: req.body.services.split(","),
    address: req.body.address,
    mainlocation: req.body.mainlocation,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    loc_type: req.body.loc_type.split(",")
  })
  addNetworkPoint.save((err, task) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
       res
         .status(201)
         .json({
            "message": "Success:Added network point " + req.body.location
    });
    }
  });
}

module.exports.addNodes = async function(req, res) {
  var networkid = req.params.networkId // .toString();
  if (networkid) {
    addNewNetwork
      .findOne({location : networkid}) // . findById(networkid)
      .select('nodes')
      .exec((err, network) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          doAddNodes(req, res, network);
        }
      }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, networkid required"
      });
  }
};

module.exports.updNetwork = async function(req, res) {
  var networkid = req.params.networkId // .toString();
  if (networkid) {
    addNewNetwork
      .findOne({location : networkid}) // . findById(networkid)
      //.select('nodes')
      .exec((err, network) => {
        if (err) {
          res
            .status(400)
            .json(err);
        }
        network.services = req.body.services.split(","),
        network.address = req.body.address,
        network.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        network.loc_type = req.body.loc_type.split(",")
        network.save((err, network) => {
          if (err) {
            res
              .status(400)
              .json(err);
          } else {
             res
               .status(201)
               .json({
                  "message": "Updated network details"
          });
          }
        });
      }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, networkid required"
      });
  }
};

module.exports.updNodes = async function(req, res) {
  var networkid = req.params.networkId // .toString();
  var nodesId = req.params.nodesId
  if (networkid || nodesId) {
    addNewNetwork
      .findOne({location : networkid}) // . findById(networkid)
      .select('nodes')
      .exec((err, network) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          if (network.nodes && network.nodes.length > 0) {
            thisNode = network.nodes.id(req.params.nodesId);
            if (!thisNode){
              res
                .status(404)
                .json({
                  "message": "Node Id not found"
                });
            } else {
              thisNode.distance = req.body.distance,
              thisNode.cost = req.body.cost,
              thisNode.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)]
              network.save(function(err,network){
                if (err){
                  res
                    .status(404)
                    .json(err);
                } else {
                  res
                    .status(201)
                    .json({
                       "message": "Success updated node to " + networkid
               });
                }
              });
            }
          }
        }
      }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "Not found, networkid or nodesid required"
      });
  }
};


  const doAddNodes = function(req, res, network) {
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
              "message": "Success added nodes to a network " //+ nodename
      });
      }
    });
  }
};
