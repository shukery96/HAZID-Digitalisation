//For the overarching workshop routes

const router = require("express").Router();
let Workshop = require("../models/workshop.model");
// let WorkshopComplete = require("../models/workshopComplete.model");
let Hazard = require("../models/hazard.model");

var xl = require("excel4node");
var exportFile = require("../util/export2Excel.js");

//To Handle GET Requests
router.route("/").get((req, res) => {
  Workshop.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/exportToExcel").post((req, res) => {
  const jsonData = req.body;
  var excelData = exportFile.saveToExcel(jsonData);
  excelData.write("WorkshopExcel.xlsx", res);
});

/**
 * Retrieve Hazard Data from endpoint
 */
router.route("/hazard").get((req, res) => {
  Hazard.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error" + err));
});

/**
 * Add Hazard to endpoint
 */
router.route("/addHazard").post((req, res) => {
  const hazardName = req.body.hazardName;
  const causes = req.body.causes;
  const consequences = req.body.consequences;
  const preventativeSafeguards = req.body.preventativeSafeguards;
  const mitigatingSafeguards = req.body.mitigatingSafeguards;

  const newHazard = new Hazard({
    hazardName,
    causes,
    consequences,
    preventativeSafeguards,
    mitigatingSafeguards,
  });

  console.log("Router Saving Hazard");

  newHazard
    .save()
    .then(() => res.json("Hazard Added"))
    .catch((err) => res.status(400).json("Error" + err));
});

//Delete Hazard
router.route("/deleteHazard").delete((req, res) => {
  // const id = req.body.id;
  Hazard.findByIdAndDelete(req.body.id)
    .then(() => res.json("Hazard Deleted"))
    .catch((err) => res.status(404).json("Error" + err));
});

//Update Hazard
router.route("/updateHazard").post((req, res) => {
  const id = req.body.id; //Id to update the hazard

  const hazardName = req.body.hazardName;
  const causes = req.body.causes;
  const consequences = req.body.consequences;
  const preventativeSafeguards = req.body.preventativeSafeguards;
  const mitigatingSafeguards = req.body.mitigatingSafeguards;

  var updatedHazard = {
    hazardName,
    causes,
    consequences,
    preventativeSafeguards,
    mitigatingSafeguards,
  };

  Hazard.findByIdAndUpdate(req.body.id, updatedHazard)
    .then(() => res.json("Hazard Updated"))
    .catch((err) => res.status(404).json("Error: " + err));
});

//POST Request - Add Workshop
router.route("/addWorkshop").post((req, res) => {
  const workshopName = req.body.workshopName;
  const tags = req.body.tags;
  const nodes = req.body.nodes;

  const newWorkshop = new Workshop({
    workshopName,
    tags,
    nodes,
  });

  console.log("Router Saving Workshop");

  newWorkshop
    .save()
    .then(() => res.json("Workshop Added"))
    .catch((err) => res.status(400).json("Error" + err));
});

//Update Workshop
router.route("/updateWorkshop").post((req, res) => {
  const nodes = req.body.nodes;
  const workshopName = req.body.workshopName;
  const tags = req.body.tags;

  var workshop = {
    workshopName,
    nodes,
    tags,
  };

  console.log("workshop data", JSON.stringify(workshop));

  Workshop.findByIdAndUpdate(req.body.id, workshop)
    .then(() => res.json("Workshop Updated"))
    .catch((err) => res.status(404).json("Error: " + err));
});

//Get Workshop Data
router.route("/workshopDetails/:id").get((req, res) => {
  Workshop.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Workshop.findByIdAndDelete(req.params.id)
    .then(() => res.json("Workshop deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
