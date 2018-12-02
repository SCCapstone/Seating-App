const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Reservation", reservationSchema);
