import React, { Component } from "react";
import "../FacilitatorPage.css";
import EditWorkshopBody from "./EditWorkshopComponents/EditWorkshopBodyComponent";
import axios from "axios";
import { Button, Popconfirm } from "antd";
import { addVisibilityElement, deleteItemFromIndex } from "../util/Utilities";
import EditNodeNameModal from "./EditWorkshopComponents/EditNodeNameModal";
import EditSubnodeNameModal from "./EditWorkshopComponents/EditSubnodeNameModal";
import EditHazardNameModal from "./EditWorkshopComponents/EditHazardNameModal";

//Used to Edit the contents of a workshop from
export default class EditWorkshop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nodeSelected: "", //Change this to an object
      subnodeSelected: "", //Change this to an object with index
      hazardSelected: "",
      nodeSelIndex: 0,
      subnodeSelIndex: 0,
      hazardSelndex: 0,
      isOpenNodeNameModal: false,
      isOpenSubnodeNameModal: false,
      isOpenHazardNameModal: false,
      isHazardSelected: false,
      tags: [""],
      data: {
        workshop: "",
        workshopName: "",
        tags: [""],
        _id: "",
        nodes: [
          {
            nodeName: "",
            subnodes: [
              {
                subnodeName: "",
                hazards: [
                  {
                    hazardName: "",
                    causes: [""],
                    consequences: [""],
                    preventativeSafeguards: [""],
                    mitigatingSafeguards: [""],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    this.setNodeSelected = this.setNodeSelected.bind(this);
    this.loadData = this.loadData.bind(this);
    this.addNodeToNodeList = this.addNodeToNodeList.bind(this);
    this.addSubNodeToNode = this.addSubNodeToNode.bind(this);
    this.addHazardToSubNode = this.addHazardToSubNode.bind(this);
    this.deleteNodeFromNodeList = this.deleteNodeFromNodeList.bind(this);
    this.deleteSubNodeFromNode = this.deleteSubNodeFromNode.bind(this);
    this.deleteHazardFromSubNode = this.deleteHazardFromSubNode.bind(this);

    this.updateNodeHazard = this.updateNodeHazard.bind(this);
    this.openNodeNameModal = this.openNodeNameModal.bind(this);
    this.closeNodeNameModal = this.closeNodeNameModal.bind(this);
    this.closeSaveNodeNameModal = this.closeSaveNodeNameModal.bind(this);

    this.openSubnodeNameModal = this.openSubnodeNameModal.bind(this);
    this.closeSaveSubnodeNameModal = this.closeSaveSubnodeNameModal.bind(this);
    this.closeSubnodeNameModal = this.closeSubnodeNameModal.bind(this);

    this.openHazardNameModal = this.openHazardNameModal.bind(this);
    this.closeSaveHazardNameModal = this.closeSaveHazardNameModal.bind(this);
    this.closeHazardNameModal = this.closeHazardNameModal.bind(this);

    this.updateName = this.updateName.bind(this);
  }

  componentDidMount() {
    console.log(this.props.location.state.workshop._id, "Workshop Generated");
    const propsWorkshopId = this.props.location.state.workshop._id;
    console.log(propsWorkshopId);

    this.timer = setInterval(() => this.loadData(propsWorkshopId), 500);
  }

  loadData(workshopId) {
    //Need to solve async issue - if i dont put this, sometimes an undefined workshopID is passed, hence the param, might be wrong since it doesnt point to an appropriate endpoint
    if (workshopId !== "undefined") {
      var apiEndpoint =
        "http://localhost:5000/workshop/workshopDetails/" + workshopId;

      axios.get(apiEndpoint).then((response) => {
        this.setState({
          data: response.data,
          workshopName: response.data.workshopName,
          tags: response.data.tags,
        });
      });
    }
  }

  updateNodeHazard(updatedHazard) {
    const { nodeSelIndex, subnodeSelIndex, hazardSelndex } = this.state;
    console.log(
      "Node Index: ",
      nodeSelIndex,
      " subnode Index: ",
      subnodeSelIndex,
      " hazard Index: ",
      hazardSelndex
    );

    //Update the hazard with the current proposed Hazard
    var data = { ...this.state.data };
    console.log("Workshop before update");
    console.log("Workshop Data: ", data);

    console.log("Workshop after update");
    data.nodes[nodeSelIndex].subnodes[subnodeSelIndex].hazards[hazardSelndex] =
      updatedHazard;
    console.log("Workshop Data: ", data);

    this.saveDataToBackend(data);
  }

  updateName() {
    var nodeName = this.state.nodeSelected;
    var nodeIndex = this.state.nodeSelIndex;
    var subnodeName = this.state.subnodeSelected;
    var subnodeIndex = this.state.subnodeSelIndex;
    var hazardName = this.state.hazardSelected;
    var hazardIndex = this.state.hazardSelndex;

    var data = { ...this.state.data };

    data.nodes[nodeIndex].nodeName = nodeName;
    data.nodes[nodeIndex].subnodes[subnodeIndex].subnodeName = subnodeName;
    data.nodes[nodeIndex].subnodes[subnodeIndex].hazards[
      hazardIndex
    ].hazardName = hazardName;

    console.log("(Update Name) Workshop Data: ", data);
    this.saveDataToBackend(data);
  }

  saveDataToBackend(data) {
    //From the workshop ID it replaces the values, the body will be the data Item
    const payload = {
      id: this.state.data._id,
      workshopName: data.workshopName,
      tags: data.tags,
      nodes: data.nodes,
    };

    console.log("Update Data to BACKEND: ", payload);
    axios.post("http://localhost:5000/workshop/updateWorkshop", payload); //Send Payload to Backend
  }

  setNodeSelected(
    nameNode,
    nameSubnode,
    nameHazard,
    nodeIndex,
    subnodeIndex,
    hazardIndex
  ) {
    this.setState({
      nodeSelected: nameNode,
      subnodeSelected: nameSubnode,
      hazardSelected: nameHazard,
      nodeSelIndex: nodeIndex,
      subnodeSelIndex: subnodeIndex,
      hazardSelndex: hazardIndex,
      isHazardSelected: true,
    });
  }

  /**
   * Adds Node to node list
   * @param {Obj} node to be added
   */
  addNodeToNodeList(node) {
    var data = { ...this.state.data };
    var nodes = [...this.state.data.nodes];
    nodes.push(node);
    data.nodes = nodes;
    console.log("update Data w addNode:", data);
    this.saveDataToBackend(data);
  }

  deleteNodeFromNodeList() {
    const { nodeSelIndex, isHazardSelected } = this.state;
    if (isHazardSelected) {
      var data = { ...this.state.data };
      var nodes = [...this.state.data.nodes];
      var updateNodeList = deleteItemFromIndex(nodes, nodeSelIndex); //Remove data from array
      // console.log("Deleted Update:", updateNodeList);
      data.nodes = updateNodeList;
      this.saveDataToBackend(data);
      this.setState({
        isHazardSelected: false,
        nodeSelected: "",
        subnodeSelected: "",
        hazardSelected: "",
      });
    } else {
      alert("Please select a node to be deleted");
    }
  }

  /**
   *  Adds subnode to node selected takes in the index of the node to be appended
   * @param {Num} nodeIndex  of the node to be appended to
   * @param {Obj} subNode  Object of subnode to be added
   */
  addSubNodeToNode(nodeIndex, subNode) {
    var nodeUpdate = { ...this.state.data.nodes[nodeIndex] };
    nodeUpdate.subnodes.push(subNode); //increment the subnodes to the particular node
    var data = { ...this.state.data };
    data.nodes[nodeIndex] = nodeUpdate;
    this.saveDataToBackend(data);
  }

  deleteSubNodeFromNode() {
    const { nodeSelIndex, subnodeSelIndex, isHazardSelected } = this.state;
    if (isHazardSelected) {
      var data = { ...this.state.data };
      var subNodeList = [...this.state.data.nodes[nodeSelIndex].subnodes];
      var updatedSubNodeList = deleteItemFromIndex(
        subNodeList,
        subnodeSelIndex
      );
      data.nodes[nodeSelIndex].subnodes = updatedSubNodeList;
      // console.log("Deleted Subnode Update:", data);
      this.saveDataToBackend(data);
      this.setState({
        isHazardSelected: false,
        nodeSelected: "",
        subnodeSelected: "",
        hazardSelected: "",
      });
    } else {
      alert("Please select a subnode to be deleted");
    }
  }

  /**
   * Adds Hazard to subnode
   * @param {Num} nodeIndex index of Node to be appended to
   * @param {Num} subNodeIndex index of subnode to be appended to
   * @param {Num} hazardData Object data to be appended
   */
  addHazardToSubNode(nodeIndex, subNodeIndex, hazardData) {
    var subNodeUpdate = {
      ...this.state.data.nodes[nodeIndex].subnodes[subNodeIndex],
    };
    //Hazard Data should be visible
    var hazardDataWVisiblility = addVisibilityElement(hazardData);
    subNodeUpdate.hazards.push(hazardDataWVisiblility);
    var data = { ...this.state.data };
    data.nodes[nodeIndex].subnodes[subNodeIndex] = subNodeUpdate;
    this.saveDataToBackend(data);
  }

  deleteHazardFromSubNode() {
    const { nodeSelIndex, subnodeSelIndex, hazardSelndex, isHazardSelected } =
      this.state;
    if (isHazardSelected) {
      var data = { ...this.state.data };
      //Need tocheck if the hazard even exists
      var hazardList = [
        ...this.state.data.nodes[nodeSelIndex].subnodes[subnodeSelIndex]
          .hazards,
      ];

      var updatedHazardList = deleteItemFromIndex(hazardList, hazardSelndex);
      data.nodes[nodeSelIndex].subnodes[subnodeSelIndex].hazards =
        updatedHazardList;
      this.saveDataToBackend(data);
      this.setState({
        isHazardSelected: false,
        nodeSelected: "",
        subnodeSelected: "",
        hazardSelected: "",
      });
    } else {
      alert("Please select a subnode to be deleted");
    }
  }

  openNodeNameModal() {
    this.setState({ isOpenNodeNameModal: true });
  }

  closeSaveNodeNameModal(nodeName) {
    console.log("SAVED RENAMED Node Modal:", nodeName);
    //Save this data to the backend
    this.setState({ nodeSelected: nodeName }, () => {
      this.updateName();
    });

    this.closeNodeNameModal();
  }

  closeNodeNameModal() {
    this.setState({ isOpenNodeNameModal: false });
  }

  openSubnodeNameModal() {
    this.setState({ isOpenSubnodeNameModal: true });
  }

  closeSaveSubnodeNameModal(subnodeName) {
    console.log("SAVED RENAMED SubnodeNode Modal:", subnodeName);
    this.setState({ subnodeSelected: subnodeName }, () => {
      this.updateName();
    });
    this.closeSubnodeNameModal();
  }

  closeSubnodeNameModal() {
    this.setState({ isOpenSubnodeNameModal: false });
  }

  openHazardNameModal() {
    this.setState({ isOpenHazardNameModal: true });
  }

  closeSaveHazardNameModal(hazardName) {
    console.log("SAVED RENAMED Hazard Modal:", hazardName);
    this.setState({ hazardSelected: hazardName }, () => {
      this.updateName();
    });

    //Needs to be saved to backend
    this.closeHazardNameModal();
  }

  closeHazardNameModal() {
    this.setState({ isOpenHazardNameModal: false });
  }

  render() {
    const {
      isOpenNodeNameModal,
      isOpenSubnodeNameModal,
      isOpenHazardNameModal,
    } = this.state;

    return (
      <div>
        <div className="ew-header">
          <EditNodeNameModal
            visible={isOpenNodeNameModal}
            closeModal={this.closeSaveNodeNameModal}
            hideModal={this.closeNodeNameModal}
          />
          <EditSubnodeNameModal
            visible={isOpenSubnodeNameModal}
            closeModal={this.closeSaveSubnodeNameModal}
            hideModal={this.closeSubnodeNameModal}
          />
          <EditHazardNameModal
            visible={isOpenHazardNameModal}
            closeModal={this.closeSaveHazardNameModal}
            hideModal={this.closeHazardNameModal}
          />
          <div className="ew-header-left-col">
            <div className="ew-header-title">{this.state.workshopName}</div>

            <div className="ew-header-node-details">
              <div className="ew-node-details-col1">
                <div className="item-subtitle">
                  <div className="ew-node-title">Node Assessed:</div>
                  <div className="item-content">{this.state.nodeSelected}</div>
                </div>
                <div className="item-subtitle">
                  <div className="ew-node-title">Sub node Assessed:</div>
                  <div className="item-content">
                    {this.state.subnodeSelected}
                  </div>
                </div>
                <div className="item-subtitle">
                  <div className="ew-node-title">Hazard Assessed:</div>
                  <div className="item-content">
                    {this.state.hazardSelected}
                  </div>
                </div>
              </div>
              <div className="ew-node-details-col2">
                <div className="ew-row-button">
                  <div className="ew-edit-button">
                    <Button
                      className="item-button"
                      type="link"
                      style={{
                        alignItem: "flex-end",
                        fontSize: "17px",
                        marginRight: "60px",
                      }}
                      onClick={this.openNodeNameModal}
                    >
                      Edit Node Name
                    </Button>
                  </div>

                  <Popconfirm
                    title="Are you sure you want to delete node?"
                    onConfirm={this.deleteNodeFromNodeList}
                  >
                    <Button
                      className="item-button"
                      type="link"
                      style={{ alignItem: "flex-end", fontSize: "17px" }}
                    >
                      Delete Node
                    </Button>
                  </Popconfirm>
                </div>
                <div className="ew-row-button">
                  <div className="ew-edit-button">
                    <Button
                      className="item-button"
                      type="link"
                      style={{
                        alignItem: "flex-end",
                        fontSize: "17px",
                      }}
                      onClick={this.openSubnodeNameModal}
                    >
                      Edit Subnode Name
                    </Button>
                  </div>
                  <Popconfirm
                    title="Are you sure you want to delete subnode?"
                    onConfirm={this.deleteSubNodeFromNode}
                  >
                    <Button
                      className="item-button"
                      type="link"
                      style={{ alignItem: "flex-end", fontSize: "17px" }}
                    >
                      Delete SubNode
                    </Button>
                  </Popconfirm>
                </div>
                <div className="ew-row-button">
                  <div className="ew-edit-button">
                    <Button
                      className="item-button"
                      type="link"
                      style={{
                        alignItem: "flex-end",
                        fontSize: "17px",
                        marginRight: "30px",
                      }}
                      onClick={this.openHazardNameModal}
                    >
                      Edit Hazard Name
                    </Button>
                  </div>

                  <Popconfirm
                    title="Are you sure you want to delete hazard?"
                    onConfirm={this.deleteHazardFromSubNode}
                  >
                    <Button
                      className="item-button"
                      type="link"
                      style={{ alignItem: "flex-end", fontSize: "17px" }}
                    >
                      Delete Hazard
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>

          <div className="ew-header-right-col">
            <div className="ew-tags">
              <div className="ew-tags-title">Tags </div>
              {this.state.tags.map((tag, index) => {
                return (
                  <div className="ew-node-details-tags" key={index}>
                    [ {tag} ]
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <EditWorkshopBody
          data={this.state.data}
          setNodeSelected={this.setNodeSelected}
          addNode={this.addNodeToNodeList}
          addSubNode={this.addSubNodeToNode}
          addHazard={this.addHazardToSubNode}
          updateNodeHazard={this.updateNodeHazard}
        />
      </div>
    );
  }
}
