const mongoose = require("mongoose");

const floorplanSchema = mongoose.Schema({
  json: { type: JSON, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Floorplan", floorplanSchema);
