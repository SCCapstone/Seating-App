const express = require("express");

const StoreController = require("../controllers/stores");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, StoreController.createStore);

router.put("/:id", checkAuth, StoreController.updateStore);

router.get("", StoreController.getStores);

router.get("/:id", StoreController.getStore);

router.delete("/:id", checkAuth, StoreController.deleteStore);

module.exports = router;
