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

const subcomponentSchema = new Schema({
  subcomponentName: {
    type: String,
  },
  hazards: {
    type: [hazardSchema],
  },
});

const componentSchema = new Schema({
  componentName: {
    type: String,
  },
  subcomponents: {
    type: [subcomponentSchema],
  },
});

const workshopCompleteSchema = new Schema({
  workshopName: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: ["pending"],
  },
  components: {
    type: [componentSchema],
  },
});

const workshopComplete = mongoose.model(
  "workshopComplete",
  workshopCompleteSchema,
  "workshop"
); //The first param specifies the collection name
module.exports = workshopComplete;
