import React, { Component } from "react";
import { message, Button } from "antd";
import { addVisibilityElement } from "../util/Utilities";

export default class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valCtr: 0,
      data: [
        { name: "workshop1", workshopId: "9123846os" },
        { name: "workshopr2", workshopId: "asfas9123846os" },
      ],

      hazardData: {
        id: "",
        hazardName: "Default",
        causes: ["Default"],
        consequences: ["consequence 1", "consequence 2"],
        preventativeSafeguards: ["Default"],
        mitigatingSafeguards: ["Default"],
      },
    };

    this.addVisibilityElement = this.addVisibilityElement.bind(this);
    this.testSaveFile = this.testSaveFile.bind(this);
  }

  testSaveFile() {
    alert("Saving test file");
  }

  printMessage() {
    alert("Test Button");
  }

  info = () => {
    message.info("This is a normal message");
  };

  addVisibilityElement() {
    addVisibilityElement(this.state.hazardData);
  }

  render() {
    return (
      <div
        className="mainpage-div"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
        }}
      >
        {" "}
        HomePage
        <Button onClick={this.testSaveFile}> Test Blob Functionality</Button>
      </div>
    );
  }
}
