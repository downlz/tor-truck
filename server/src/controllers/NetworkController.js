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
            "message": "Success:Added network point"
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
      .select('nodes')
      .exec((err, network) => {
        if (err) {
          res
            .status(400)
            .json(err);
        } else {
          doUpdNetwork(req, res, network);
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

const doUpdNetwork = function(req, res, network) {
if (!network) {
  res
    .status(404)
    .json({
      "message": "networkid not found"
    });
} else {
  network.nodes.push({
    services: req.body.services.split(","),
    address: req.body.address,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    loc_type: req.body.loc_type.split(",")
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
            "message": "Updated network details"
    });
    }
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
              "message": "Success added nodes to a network"
      });
      }
    });
  }
};
