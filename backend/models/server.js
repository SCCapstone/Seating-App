const mongoose = require("mongoose");

const serverSchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  store: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Server", serverSchema);
