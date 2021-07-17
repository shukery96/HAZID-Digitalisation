import React, { Component } from "react";
import { Modal, message, Alert, Input } from "antd";
import { isEmptyString } from "../../util/Utilities";
import { hazardTemplate } from "../../util/JSONHandler";

export default class AddHazardWithOptionsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hazardName: "",
      emptyHazardName: false,
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateHazardName = this.updateHazardName.bind(this);
  }

  handleOk() {
    var { hazardName } = this.state;
    if (!isEmptyString(hazardName)) {
      var hazardUpdate = { ...hazardTemplate };
      hazardUpdate.hazardName = hazardName;
      console.log("HAZARD ADDED: ", hazardUpdate);
      this.props.closeModal(hazardUpdate);
    } else {
      this.setState({ emptyHazardName: false });
      this.showEmptyHazardAlert();
    }
  }

  handleCancel() {
    this.props.hideModal();
  }

  updateHazardName = (e) => {
    this.setState({ hazardName: e.target.value });
  };

  showEmptyHazardAlert() {
    message.error({
      content: "Please enter a name for the Hazard",
      className: "custom-class",
      style: {
        marginTop: "2vh",
      },
    });
  }

  render() {
    const { emptyHazardName } = this.state;
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {emptyHazardName ? (
            <Alert description="Please enter a name " type="error" closable />
          ) : null}
          <h3>Hazard Name</h3>
          <Input
            placeholder="Hazard Name"
            onChange={this.updateHazardName}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}
