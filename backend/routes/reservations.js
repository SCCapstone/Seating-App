const express = require("express");

const ReservationController = require("../controllers/reservations");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, ReservationController.createReservation);

router.put("/:id", checkAuth, ReservationController.updateReservation);

router.get("", ReservationController.getReservations);

router.get("/:id", ReservationController.getReservation);

router.delete("/:id", checkAuth, ReservationController.deleteReservation);

module.exports = router;
