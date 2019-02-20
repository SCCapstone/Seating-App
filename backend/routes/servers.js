const express = require("express");

const ServerController = require("../controllers/servers");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, ServerController.createServer);

router.put("/:id", checkAuth, ServerController.updateServer);

router.get("", ServerController.getServers);

router.get("/:id", ServerController.getServer);

router.delete("/:id", checkAuth, ServerController.deleteServer);

module.exports = router;
