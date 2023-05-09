const mongoose = require("mongoose");

const { Schema } = mongoose;

const EntitySchema = new Schema({
    name: String,
    type: String,
    amount: Number,
});

module.exports = mongoose.model("Entity", EntitySchema);