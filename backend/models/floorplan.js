const mongoose = require("mongoose");

const floorplanSchema = mongoose.Schema({
  name: { type: String, required: true },
  json: { type: JSON, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  storeId: { type: String, required: true }
});

module.exports = mongoose.model("Floorplan", floorplanSchema);
