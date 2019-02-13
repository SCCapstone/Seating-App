const express = require("express");

const FloorplanController = require("../controllers/floorplans");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, FloorplanController.createFloorplan);

router.put("/:id", checkAuth, FloorplanController.updateFloorplan);

// router.get("", FloorplanController.getFloorplans);

router.get("/:id", FloorplanController.getFloorplan);

router.delete("/:id", checkAuth, FloorplanController.deleteFloorplan);

module.exports = router;
