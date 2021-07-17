const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hazardSchema = new Schema({
  hazardName: {
    type: String,
  },
  causes: {
    type: [String],
  },
  consequences: {
    type: [String],
  },
  preventativeSafeguards: {
    type: [String],
  },
  mitigatingSafeguards: {
    type: [String],
  },
});

const hazardDatabase = mongoose.model("hazard", hazardSchema, "hazardDatabase"); //The first param specifies the collection name
module.exports = hazardDatabase;
