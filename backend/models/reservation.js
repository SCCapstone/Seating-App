const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  phone: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, required: false },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  store: { type: String, required: true}
});

module.exports = mongoose.model("Reservation", reservationSchema);
