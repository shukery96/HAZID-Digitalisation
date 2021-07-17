//Updated CreateWorkshop Modal - with node
import React, { Component } from "react";
import { Modal, Input, Alert, Button, message } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import {
  capitalizeFirstLetter,
  isEmptyString,
  deleteItemFromIndex,
  swapWithPrevious,
  swapWithNext,
} from "../../util/Utilities";
import { getNodeTemplate } from "../../util/JSONHandler";

import axios from "axios";
import NodeField from "./NodeField";

//Modal used To Create Workshop From the Workshop Creation Page
export default class CreateWorkshopModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmLoading: false,
      workshopName: "",
      emptyWorkshopName: false,
      nodes: [],
      nodeName: "",
    };

    this.handleOk = this.handleOk.bind(this);
    this.showEmptyWorkshopNameAlert =
      this.showEmptyWorkshopNameAlert.bind(this);
  }

  componentDidMount() {
    console.log(" Workshop Modal Created");
  }

  /**
   * Stores Data to Backend if fields are valid
   */
  handleOk = () => {
    //Assert Workshop Name
    if (!isEmptyString(this.state.workshopName)) {
      this.setState({
        confirmLoading: true,
      });

      //Update Node Formatting with templates
      var formattedNodes = [];
      this.state.nodes.forEach((node) => {
        formattedNodes.push(getNodeTemplate(node.nodeName, node.noSubnodes));
      });

      const payload = {
        workshopName: capitalizeFirstLetter(this.state.workshopName),
        tags: ["Empty"],
        nodes: formattedNodes,
      };

      console.log("Saving New Workshop to Database");

      // console.log("New Workshop Payload: ", payload);
      axios.post("http://localhost:5000/workshop/addWorkshop", payload); //Need to change to fit nodes

      setTimeout(() => {
        this.setState({
          confirmLoading: false,
          workshopName: "",
          nodes: [],
        });
        this.props.closeModal();
      }, 1000);

      message.success({
        content: "Workshop created successfully!",
        className: "custom-class",
        style: {
          marginTop: "2vh",
        },
      });
    } else {
      this.setState({ emptyWorkshopName: true });
      this.showEmptyWorkshopNameAlert();
    }
  };

  /**
   * Closes Modal onClick cancel
   */
  handleCancel = () => {
    this.props.closeModal();
  };

  /**
   * Sets name of Workshop
   * @param {String} e value of event
   */
  updateWorkshopName = (e) => {
    this.setState({ workshopName: e.target.value });
  };

  /**
   *  Adds Default Node to list of nodes
   */
  addNode = () => {
    var nodeName;
    this.state.nodeName === ""
      ? (nodeName = "Default Node")
      : (nodeName = this.state.nodeName);

    const node = {
      nodeName: nodeName,
      noSubnodes: 1,
    };

    this.setState({
      nodes: [...this.state.nodes, node],
    });
  };

  /**
   *  Updates Node Name to be added from the Input Field
   * @param {String} e nodeName
   */
  updateNodeName = (e) => {
    this.setState({ nodeName: e.target.value });
  };

  /**
   *  Deletes Node from Node List
   * @param {Number} indexOfNode to be deleted
   */
  nodeDeletion = (indexOfNode) => {
    console.log("Node To Be Deleted: ", this.state.nodes[indexOfNode].nodeName);
    var updatedNodes = deleteItemFromIndex(this.state.nodes, indexOfNode);
    console.log("Updated Nodes: ", updatedNodes);
    this.setState({ nodes: updatedNodes });
  };

  /**
   * Updates the value of the no of Subnodes a node has
   * @param {Number} indexOfNode - index of the node to update the number of subnodes
   * @param {Number} value - updated value to be stored
   */
  updateNoSubnodes = (indexOfNode, value) => {
    var updatedNode = this.state.nodes[indexOfNode]; //pass by reference
    updatedNode.noSubnodes = value;

    console.log("Updated subnode value:", updatedNode.noSubnodes);
  };

  /**
   * Re-order node with previous node in the list
   * @param {number} index - index of node to be swapped
   */
  swapNodeWithPrevious = (index) => {
    var swappedNodes = swapWithPrevious(this.state.nodes, index);
    this.setState({ nodes: swappedNodes });
  };

  /**
   * Re-order node with next node in the list
   * @param {number} index - index of node to be swapped
   * */
  swapNodeWithNext = (index) => {
    var swappedNodes = swapWithNext(this.state.nodes, index);
    this.setState({ nodes: swappedNodes });
  };

  /**
   * Displays Empty Workshop Name alert
   */
  showEmptyWorkshopNameAlert() {
    message.error({
      content: "Upload failed, please enter a name for the workshop",
      className: "custom-class",
      style: {
        marginTop: "2vh",
      },
    });
  }

  render() {
    const { confirmLoading, emptyWorkshopName } = this.state;
    return (
      <div className="create-workshop-modal">
        <Modal
          title="Create New Workshop"
          visible={this.props.visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          {emptyWorkshopName ? (
            <Alert description="Please enter a name " type="error" closable />
          ) : null}

          <h3 className="cwm-subheaders">Workshop Name</h3>
          <div className="workshop-name-box">
            <Input
              placeholder="Type in workshop name"
              onChange={this.updateWorkshopName}
            />
          </div>

          <h4 className="cwm-subheaders">Nodes</h4>
          <div style={{ display: "flex" }}>
            <Input
              placeholder="Node Name"
              onChange={this.updateNodeName}
              allowClear
            />
            <Button type="primary" onClick={this.addNode}>
              <PlusSquareOutlined />
              Add Node
            </Button>
          </div>
          <h4 className="cwm-subheaders">Nodes Listed: </h4>
          <div className="cwm-nf-list">
            {this.state.nodes.map((node, i) => {
              return (
                <NodeField
                  node={node}
                  index={i}
                  key={i}
                  nodeDeletion={this.nodeDeletion}
                  swapNodeWithNext={this.swapNodeWithNext}
                  swapNodeWithPrevious={this.swapNodeWithPrevious}
                  updateNoSubnodes={this.updateNoSubnodes}
                />
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
}
