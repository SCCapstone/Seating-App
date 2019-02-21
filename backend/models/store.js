const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  name: { type: String, required: true },
  defaultFloorplan: {type: String, required: false},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Store", storeSchema);
