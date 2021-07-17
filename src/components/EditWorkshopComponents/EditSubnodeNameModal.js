import React, { Component } from "react";
import { Modal, Alert, Input, message } from "antd";
import { isEmptyString } from "../../util/Utilities";

export default class EditSubnodeNameModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      subNodeName: "",
      emptySubnodeName: false,
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.showEmptySubnodeNameAlert = this.showEmptySubnodeNameAlert.bind(this);
  }

  handleOk() {
    var { subNodeName } = this.state;
    if (!isEmptyString(subNodeName)) {
      this.props.closeModal(subNodeName);
    } else {
      this.setState({ emptySubnodeName: true });
      this.showEmptySubnodeNameAlert();
    }
  }

  updateSubnodeName = (e) => {
    this.setState({ subNodeName: e.target.value });
  };

  handleCancel() {
    this.props.hideModal();
  }
  showEmptySubnodeNameAlert() {
    message.error({
      content: "Please enter a name for the subnode",
      className: "custom-class",
      style: {
        marginTop: "2vh",
      },
    });
  }

  render() {
    const { emptySubnodeName } = this.state;
    return (
      <div>
        <Modal
          title="Change Subnode Name "
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {emptySubnodeName ? (
            <Alert description="Please enter a name " type="error" closable />
          ) : null}

          <h3>Subnode Name: </h3>
          <Input
            placeholder="Subnode Name"
            onChange={this.updateSubnodeName}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}
