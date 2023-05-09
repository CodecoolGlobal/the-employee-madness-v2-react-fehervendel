const mongoose = require("mongoose");

const { Schema } = mongoose;

const BrandSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Brand", BrandSchema);