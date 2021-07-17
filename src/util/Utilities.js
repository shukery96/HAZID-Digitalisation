/**
 * Capitalizes the first letter of a String
 * @param {string} str string to capitalise
 * @returns  String with first letter capitalised
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if the string is empty
 * @param {string} str String to check if empty
 * @returns  bool
 */
export function isEmptyString(str) {
  return str === "" || str === null;
}

/**
 * Deletes Item from array at Index
 * @param {array} array
 * @param {number} index of item to be deleted
 * @returns array with item removed
 */
export function deleteItemFromIndex(array, index) {
  var tempArray = array;
  if (index > -1) {
    tempArray.splice(index, 1);
  }
  return tempArray;
}

/**
 *  Swaps from higherIndex to lowerIndex
 * @param {array} array - to be swapped
 * @param {number} index - of item to be swapped
 * @returns
 */
export function swapWithPrevious(array, index) {
  var tempArray = array;
  if (index > 0) {
    var temp = tempArray[index];
    tempArray[index] = tempArray[index - 1];
    tempArray[index - 1] = temp;
  }
  return tempArray;
}

/**
 *  Swaps from lowerIndex to higherIndex
 * @param {array} array - to be swapped
 * @param {number} index - of item to be swapped
 * @returns
 */
export function swapWithNext(array, index) {
  var tempArray = array;

  //check if boundary exceeded
  if (index < array.length - 1) {
    var temp = tempArray[index];
    tempArray[index] = tempArray[index + 1];
    tempArray[index + 1] = temp;
  }
  return tempArray;
}

/**
 * Modifies uploaded Workshop schema to suit local use, by adding visibility element
 * @param {JSON} workshopObj
 * @returns updated json with visibility element
 */
/**
 * Modifies uploaded Workshop schema to suit local use, by adding visibility element
 * @param {JSON} workshopObj
 * @param {boolean} isHazardAllocated sets whether the default hazard should be true/false
 * @returns updated json with visibility element
 */
export function addVisibilityToWorkshop(workshopObjData, isHazardAllocated) {
  //Iterates through the nodes/subnodes,
  var workshopObj = { ...workshopObjData };

  var updatedNodeList = [];

  workshopObj.nodes.forEach((node, nodeIndex) => {
    //as it iterates through the nodes
    var nodeName = node.nodeName;
    var updatedSubnodeList = [];

    node.subnodes.forEach((subnode, subnodeIndex) => {
      var subnodeName = subnode.subnodeName;
      var updatedHazardList = []; //adds to the hazard List of a subnode

      subnode.hazards.forEach((hazard, hazardIndex) => {
        updatedHazardList.push(addVisibilityElement(hazard, isHazardAllocated));
      });

      const updatedSubnode = {
        subnodeName: subnodeName,
        hazards: updatedHazardList,
      };
      updatedSubnodeList.push(updatedSubnode);
    });

    const updatedNode = {
      nodeName: nodeName,
      subnodes: updatedSubnodeList,
    };

    updatedNodeList.push(updatedNode);
  });

  workshopObj.nodes = updatedNodeList;

  console.log("Data after being transformed: ", workshopObj);
  return workshopObj; //updatedObj
}

/**
 * Adds visiblity to an object
 * @param {json} hazard Obj
 * @returns hazard obj with all elements with visibility parameter
 */
export function addVisibilityElement(obj, isHazardAllocated) {
  var jsonData = { ...obj };
  var causes = [...jsonData.causes];
  var consequences = [...jsonData.consequences];
  var preventativeSafeguards = [...jsonData.preventativeSafeguards];
  var mitigatingSafeguards = [...jsonData.mitigatingSafeguards];
  jsonData["hazardAllocated"] = isHazardAllocated; // adds Visibility to an element requires boolean input

  var updatedCausesList = [];
  causes.forEach((cause) => {
    var tempObj = { name: cause, visible: false };
    updatedCausesList.push(tempObj);
  });
  jsonData.causes = updatedCausesList;

  var updatedConsequenceList = [];
  consequences.forEach((consequence) => {
    var tobj = { name: consequence, visible: false };
    updatedConsequenceList.push(tobj);
  });
  jsonData.consequences = updatedConsequenceList;

  var updatedPSList = [];
  preventativeSafeguards.forEach((pSafe) => {
    var tempObj = { name: pSafe, visible: false };
    updatedPSList.push(tempObj);
  });
  jsonData.preventativeSafeguards = updatedPSList;

  var updatedMSList = [];
  mitigatingSafeguards.forEach((mSafe) => {
    var tempObj = { name: mSafe, visible: false };
    updatedMSList.push(tempObj);
  });

  jsonData.mitigatingSafeguards = updatedMSList;
  console.log("json data ammended: ", jsonData);
  return jsonData;
}

/**
 *  Takes in a name and returns an object with visible element
 * @param {String} name name of field
 * @param {boolean} defaultVisibility default state of object visibility
 * @returns obj with visible parameter expressed
 */
export function addVisibilityToField(name, defaultVisibility) {
  var obj = { name: name, visible: defaultVisibility };
  return obj;
}

//Not used for now
/**
 * Check if the filetype is an excel
 * @param {object} file
 * @returns
 */
export function checkFileTypeExcel(file) {
  let errorMessage = "";
  if (!file || !file[0]) {
    return;
  }
  const isExcel =
    file[0].type === "application/vnd.ms-excel" ||
    file[0].type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    errorMessage = "You can only upload an excel file";
  }
  console.log("file", file[0].type);
  const isLt2m = file[0].size / 1024 / 1024 < 2;
  if (!isLt2m) {
    errorMessage = "File must be smaller than 2MB!";
  }
  console.log("errorMessage", errorMessage);
  return errorMessage;
}

/**
 * Checks if the jsonObject is in the correct format
 * @param {object} jsonObj to be evaluated
 * @returns
 */
export function checkFileFormat(jsonObj) {
  return true;
}
