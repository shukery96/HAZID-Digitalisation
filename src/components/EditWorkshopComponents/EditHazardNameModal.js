import React, { Component } from "react";
import { Modal, Alert, Input, message } from "antd";
import { isEmptyString } from "../../util/Utilities";

export default class EditHazardNameModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      hazardName: "",
      emptyHazardName: false,
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showEmptyHazardNameAlert = this.showEmptyHazardNameAlert.bind(this);
  }

  handleOk() {
    var { hazardName } = this.state;
    if (!isEmptyString(hazardName)) {
      this.props.closeModal(hazardName);
    } else {
      this.setState({ emptyHazardName: true });
      this.showEmptyHazardNameAlert();
    }
  }

  updateHazardName = (e) => {
    this.setState({ hazardName: e.target.value });
  };

  handleCancel() {
    this.props.hideModal();
  }
  showEmptyHazardNameAlert() {
    message.error({
      content: "Please enter a name for the hazard",
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
          title="Change Hazard Name "
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {emptyHazardName ? (
            <Alert description="Please enter a name " type="error" closable />
          ) : null}

          <h3>Hazard Name: </h3>
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
