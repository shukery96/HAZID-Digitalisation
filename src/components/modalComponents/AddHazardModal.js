import React, { Component } from "react";
import { Modal, Input, message } from "antd";
import { hazardTemplate } from "../../util/JSONHandler";
import axios from "axios";

//Used to AddHazards to Hazard Database
export default class AddHazardModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      hazardName: "",
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateHazard = this.updateHazard.bind(this);
    this.saveToBackend = this.saveToBackend.bind(this);
  }

  /**
   * Saves Hazard to Backend
   */
  saveToBackend() {
    var hazard = { ...hazardTemplate };
    hazard.hazardName = this.state.hazardName;
    if (this.state.hazardName !== "") {
      console.log("Saving data to backend: ", hazard);
      axios.post("http://localhost:5000/workshop/addHazard", hazard);
      message.success({
        content: hazard.hazardName.concat(" successfully added"),
        className: "custom-class",
        style: {
          marginTop: "2vh",
        },
      });
    } else {
      message.warning({
        content: "No Hazard added",
        className: "custom-class",
        style: {
          marginTop: "2vh",
        },
      });
    }
  }

  handleOk() {
    console.log("Save Hazard");
    this.saveToBackend();
    this.props.closeModal();
  }
  handleCancel() {
    console.log("Cancel Hazard Creation");
    this.props.closeModal();
  }

  /**
   *  Update the hazard name to be added
   * @param {event} e
   */
  updateHazard = (e) => {
    this.setState({ hazardName: e.target.value });
  };

  render() {
    return (
      <div>
        <Modal
          title="Add New Hazard"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          Hazard Name:
          <Input
            placeholder="Insert Hazard"
            onChange={this.updateHazard}
            allowClear
            style={{ marginTop: "5px" }}
          />
        </Modal>
      </div>
    );
  }
}
