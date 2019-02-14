/**
 * Floorplan Controller
 *
 * Adapted from reservation controller. Still needs work.
 */

const Floorplan = require("../models/floorplan");

exports.createFloorplan = (req, res, next) => {
  const floorplan = new Floorplan({
    json: req.body.json,
    creator: req.userData.userId
  });
  floorplan
    .save()
    .then(createdFloorplan => {
      res.status(201).json({
        message: "Floorplan added successfully",
        floorplan: {
          ...createdFloorplan,
          id: createdFloorplan._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a floorplan failed!"
      });
    });
};

exports.updateFloorplan = (req, res, next) => {
  const floorplan = new Floorplan({
    _id: req.body.id,
    json: req.body.json,
    creator: req.userData.userId
  });
  Floorplan.updateOne(
    { _id: req.params.id, creator: req.userData.userId }, floorplan
  )
  .then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update floorplan!"
    });
  });
};

exports.getFloorplan = (req, res, next) => {
  Floorplan.findById(req.params.id)
    .then(floorplan => {
      if (floorplan) {
        res.status(200).json(floorplan);
      } else {
        res.status(404).json({ message: "Floorplan not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching floorplan failed!"
      });
    });
};

exports.deleteFloorplan = (req, res, next) => {
  Floorplan.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting floorplan failed!"
      });
    });
};
