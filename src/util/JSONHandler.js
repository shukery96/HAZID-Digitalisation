//correct key names
const templateKeys = [
  "workshopName",
  "tags",
  "nodes",
  "nodeName",
  "subnodes",
  "subnodeName",
  "hazards",
  "hazardName",
  "causes",
  "consequences",
  "preventativeSafeguards",
  "mitigatingSafeguards",
];

//recursively obtain all keys used and puts them into an array
const GetAllKeys = (obj, results = []) => {
  const result = results;
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && typeof obj[key][0] !== "string") {
      if (typeof obj[key][0] === "object") result.push(key);
      GetAllKeys(obj[key], result);
    } else result.push(key);
  });

  return result;
}; //returns array of keys used in whole object

//recursively go through all keys and their values
var checkVal = 0; //global var for checking data types
const CheckAllValues = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object") CheckAllValues(obj[key]);
    else if (typeof obj[key] !== "string") checkVal -= 1;
  });

  return checkVal;
}; //returns 0 if all data types correct

//compare keys against the key template and check key value data types
//only need to import this function
export function CompareObjects(testObj) {
  //remove duplicates in array
  var testKeyArray = [...new Set(GetAllKeys(testObj))];
  //compare string versions of key array
  if (JSON.stringify(testKeyArray) === JSON.stringify(templateKeys)) {
    checkVal = 0;
    //check data type of key values
    if (CheckAllValues(testObj) === 0) return true;
  }

  return false;
}

//Ensures that repeated instances of the object are removed from the array
/**
 *
 * @param {array of objects} array
 * @param {string} hazard to be removed
 */
export function filterMoreThanOneInstanceHazard(array, hazard) {
  var oneInstanceFound = false;
  // var hazardtoNotBeRepeated = hazard;
  var filteredArray = [];
  array.forEach((hazardIter) => {
    if (hazardIter.hazardName !== hazard) {
      filteredArray.push(hazardIter);
    } else if (!oneInstanceFound && hazardIter.hazardName === hazard) {
      filteredArray.push(hazardIter);
    }

    if (hazard.hazardName === hazard) {
      oneInstanceFound = true;
    }
  });
  console.log("Filtered Hazard List:", filteredArray);
}

/**
 * PrintJSON to console
 * @param {Object} jsonObj to be console logged
 */
export function printJSON(jsonObj) {
  console.log(JSON.stringify(jsonObj));
}

/**
 * Returns a unique Subnode ID
 * @param {string} nodeName
 * @param {string} subnodeName
 * @returns  unique subnode id
 */
export function getUniqueNodeID(nodeName, subnodeName) {
  console.log("GETTING NODE NAME");
  console.log(nodeName.concat(subnodeName));
  return nodeName.concat(subnodeName);
}

/**
 *  Returns an Node with proper format
 * @param {String} name
 * @param {Number} noSubnodes
 * @returns Node with template of n no Subnodes
 */
export function getNodeTemplate(name, noSubnodes) {
  var nodeObj = {
    nodeName: name,
    subnodes: [],
  };

  for (var i = 0; i < noSubnodes; i++) {
    nodeObj.subnodes.push(subnodeTemplate);
  }
  return nodeObj;
}

export function getSubNodeTemplate(name) {
  var subnodeObj = { ...subnodeTemplate };
  subnodeObj.subnodeName = name;
  return subnodeObj;
}

/**
 *  Subnode JSON Template
 */
export const subnodeTemplate = {
  subnodeName: "Default subnode",
  hazards: [
    {
      hazardName: "Default Hazard",
      hazardAllocated: false,
      causes: [{ name: "Default Cause", visible: true }],
      consequences: [{ name: "Default Consequence", visible: true }],
      preventativeSafeguards: [
        { name: "Default preventative safeguard", visible: true },
      ],
      mitigatingSafeguards: [
        { name: "Default mitigating safeguard", visible: true },
      ],
    },
  ],
};

/**
 * Hazard JSON Template
 */
export const hazardTemplate = {
  hazardName: "Default Hazard",
  hazardAllocated: false,
  causes: ["Default Cause"],
  consequences: ["Default Consquence"],
  preventativeSafeguards: ["Default preventative safeguard"],
  mitigatingSafeguards: ["Default mitigating safeguard"],
};
