const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
});

module.exports = mongoose.model("Property", propertySchema);
