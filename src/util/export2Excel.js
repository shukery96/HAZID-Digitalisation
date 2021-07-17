var xl = require("excel4node");

//This Js Page will convert json to Excel
module.exports = {
  saveToExcel: function saveToExcel(jsonData) {
    console.log("Saving data");
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet("sheet1");

    var headerStyle = wb.createStyle({
      font: {
        // color: "#000000",
        color: "#00FF00",
        size: 11,
        bold: true,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#d9d5d4", //Both must be set for bg to work
        fgColor: "#d9d5d4",
      },
    });

    var nodeNameStyle = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
        vertAlign: "top",
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#b9eff5", //Both must be set for bg to work
        fgColor: "#b9eff5",
      },
      alignment: { vertical: "top" },
    });

    var subnodeNameStyle = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      fill: {
        type: "pattern",
        patternType: "solid",
        bgColor: "#99cc00", //Both must be set for bg to work
        fgColor: "#99cc00",
      },
      alignment: { vertical: "top" },
    });

    var hazardNameStyle = wb.createStyle({
      font: {
        color: "#000000",
        size: 11,
      },
      alignment: { wrapText: true, vertical: "top" },
    });

    //Workshop Headers
    ws.cell(1, 1).string("ID").style(headerStyle);
    ws.cell(1, 2).string("Hazard").style(headerStyle);
    ws.cell(1, 3).string("Cause").style(headerStyle);
    ws.cell(1, 4).string("Consequence").style(headerStyle);
    ws.cell(1, 5).string("Preventative Safeguards").style(headerStyle);
    ws.cell(1, 6).string("Mitigating Safeguards").style(headerStyle);
    ws.cell(1, 7, 1, 9, true)
      .string("Risk Ranking (Health& Safety")
      .style(headerStyle);
    ws.cell(1, 10).string("Risk").style(headerStyle);
    ws.cell(1, 11).string("Comments").style(headerStyle);
    ws.cell(1, 12)
      .string("Comment by Workshop Participants")
      .style(headerStyle);

    //Under Risk Ranking
    ws.cell(2, 7).string("L").style(headerStyle);
    ws.cell(2, 8).string("S").style(headerStyle);
    ws.cell(2, 9).string("Risk").style(headerStyle);

    var currentRow = 3; //Start from the third row

    console.log("data to be saved to excel", jsonData);
    jsonData.nodes.forEach((node, nodeIndex) => {
      var id = nodeIndex + 1;
      var nodeID = id.toString();
      var nodeIDstr = nodeID + ".0.0";

      console.log("id", nodeIDstr);

      ws.cell(currentRow, 1).string(nodeIDstr).style(nodeNameStyle); //ID
      ws.cell(currentRow, 2).string(node.nodeName).style(nodeNameStyle); //Name
      ws.cell(currentRow, 3, currentRow, 14).string("").style(nodeNameStyle); //ws.Cell(row1, col1, row2, col2, merge)

      node.subnodes.forEach((subnode, subnodeIndex) => {
        currentRow += 1;

        var sID = subnodeIndex + 1;
        var subnodeID = sID.toString();
        var subnodeIDstr = nodeID + "." + subnodeID + ".0";
        ws.cell(currentRow, 1).string(subnodeIDstr).style(subnodeNameStyle);
        ws.cell(currentRow, 2)
          .string(subnode.subnodeName)
          .style(subnodeNameStyle);

        //Highlights the whole column for the rest of the cell
        ws.cell(currentRow, 3, currentRow, 14)
          .string("")
          .style(subnodeNameStyle); //ws.Cell(row1, col1, row2, col2, merge)

        subnode.hazards.forEach((hazard, hazardIndex) => {
          currentRow += 1;

          var hID = hazardIndex + 1;
          var hazardID = hID.toString();
          var hazardIDstr = nodeID + "." + subnodeID + "." + hazardID;

          ws.cell(currentRow, 1).string(hazardIDstr).style(hazardNameStyle);
          ws.cell(currentRow, 2)
            .string(hazard.hazardName)
            .style(hazardNameStyle);

          //Causes/ Consequences/ Preventative / Mitigating Safeguards
          ws.cell(currentRow, 3)
            .string(convertToProperFormat(hazard.causes))
            .style(hazardNameStyle);

          ws.cell(currentRow, 4)
            .string(convertToProperFormat(hazard.consequences))
            .style(hazardNameStyle);

          ws.cell(currentRow, 5)
            .string(convertToProperFormat(hazard.preventativeSafeguards))
            .style(hazardNameStyle);
          ws.cell(currentRow, 6)
            .string(convertToProperFormat(hazard.mitigatingSafeguards))
            .style(hazardNameStyle);
        });
      });

      currentRow += 1;
    });

    return wb;
  },
};

function convertToProperFormat(array) {
  var outputString = "'";
  array.forEach((value) => {
    //Check if Value is visible
    if (value.visible == true) {
      outputString += "- " + value.name + "\r\n";
    }
  });
  return outputString;
}
