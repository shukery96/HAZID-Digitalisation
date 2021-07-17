import React, { Component } from "react";
import { Modal, message, Alert, Input } from "antd";
import { isEmptyString } from "../../util/Utilities";
import { getSubNodeTemplate } from "../../util/JSONHandler";

export default class AddSubnodeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subnodeName: "",
      emptySubNodeName: false,
    };

    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOk() {
    var { subnodeName } = this.state;
    if (!isEmptyString(subnodeName)) {
      var subNode = getSubNodeTemplate(subnodeName);
      console.log("OK SUBNODE: ", subNode);
      this.props.closeModal(subNode);
    } else {
      this.setState({ emptySubNodeName: false });
      this.showEmptySubNodeAlert();
    }
  }
  handleCancel() {
    this.props.hideModal();
  }

  updateSubnodeName = (e) => {
    this.setState({ subnodeName: e.target.value });
  };

  showEmptySubNodeAlert() {
    message.error({
      content: "Please enter a name for the sub node",
      className: "custom-class",
      style: {
        marginTop: "2vh",
      },
    });
  }

  render() {
    const { emptySubNodeName } = this.state;
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {emptySubNodeName ? (
            <Alert description="Please enter a name " type="error" closable />
          ) : null}
          <h3>Sub Node Name</h3>
          <Input
            placeholder="Sub Node Name"
            onChange={this.updateSubnodeName}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}
