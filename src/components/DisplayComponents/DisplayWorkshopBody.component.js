import React, { Component } from "react";
import "../../FacilitatorPage.css";
import { Menu, Carousel, Button, Typography } from "antd";
import AddNodeModal from "../EditWorkshopComponents/AddNodeModal";
import AddSubnodeModal from "../EditWorkshopComponents/AddSubnodeModal";
import AddHazardModal from "../EditWorkshopComponents/AddHazardWithOptionsModal";
import AddSuggestionField from "./AddSuggestionField";
import DisplaySuggestionField from "./DisplaySuggestionField";
import {
  deleteItemFromIndex,
  addVisibilityToField,
} from "../../util/Utilities";

const { SubMenu } = Menu;
const { Title } = Typography;

export default class DisplayWorkshopBody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hazardLoaded: {
        hazardName: "",
        hazardAllocated: false,
        causes: [""],
        consequences: [""],
        preventativeSafeguards: [""],
        mitigatingSafeguards: [""],
        isHazardAllocated: false,
      },
      suggestions: {
        causes: [],
        consequences: [],
        preventativeSafeguards: [],
        mitigatingSafeguards: [],
      },
      isNodeModalVisible: false,
      isSubnodeModalVisible: false,
      nodeIndexToAddSubnode: 0,
      isHazardModalVisible: false,
      subnodeIndexToAddHazard: 0,
      isHazardAllocated: false,
    };

    this.updateClickedItem = this.updateClickedItem.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();

    this.showNodeModal = this.showNodeModal.bind(this);
    this.hideNodeModal = this.hideNodeModal.bind(this);
    this.closeNodeModal = this.closeNodeModal.bind(this);

    this.showSubNodeModal = this.showSubNodeModal.bind(this);
    this.hideSubNodeModal = this.hideSubNodeModal.bind(this);
    this.closeSubNodeModal = this.closeSubNodeModal.bind(this); //need to bind if you want to use this.props

    this.showHazardModal = this.showHazardModal.bind(this);
    this.hideHazardModal = this.hideHazardModal.bind(this);
    this.closeHazardModal = this.closeHazardModal.bind(this);

    this.addSuggestionToHazard = this.addSuggestionToHazard.bind(this);
    this.deleteSuggestion = this.deleteSuggestion.bind(this);
  }

  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  //Set The State of the Component
  updateClickedItem(
    node,
    subnode,
    hazard,
    nodeIndex,
    subnodeIndex,
    hazardIndex
  ) {
    console.log("State of Menu Item Clicked Hazard", hazard);
    this.props.setNodeSelected(
      node.nodeName,
      subnode.subnodeName,
      hazard.hazardName,
      nodeIndex,
      subnodeIndex,
      hazardIndex
    );

    this.setState({ hazardLoaded: hazard });
  }

  //Update Bacekd
  updateBackend(node) {
    console.log("Update Backend");
  }

  showNodeModal() {
    this.setState({ isNodeModalVisible: true });
  }

  hideNodeModal() {
    this.setState({ isNodeModalVisible: false });
  }

  closeNodeModal(node) {
    this.props.addNode(node);
    this.hideNodeModal();
  }

  showSubNodeModal(node, nodeIndex) {
    console.log("Node to add subnode", node); //Node is actually not needed, just used for debugging
    this.setState({ nodeIndexToAddSubnode: nodeIndex });
    this.setState({ isSubnodeModalVisible: true });
  }

  hideSubNodeModal() {
    this.setState({ isSubnodeModalVisible: false });
  }

  closeSubNodeModal(subNode) {
    this.props.addSubNode(this.state.nodeIndexToAddSubnode, subNode);
    this.setState({ isSubnodeModalVisible: false });
  }

  showHazardModal(nodeIndex, subnodeIndex) {
    this.setState({ isHazardModalVisible: true });
    this.setState({ nodeIndexToAddSubnode: nodeIndex }); //set the nodeIndex to be updated
    this.setState({ subnodeIndexToAddHazard: subnodeIndex }); //set the subnodeIndex to be updated
  }
  closeHazardModal(node) {
    const { nodeIndexToAddSubnode, subnodeIndexToAddHazard } = this.state;
    this.props.addHazard(nodeIndexToAddSubnode, subnodeIndexToAddHazard, node);
    this.setState({ isHazardModalVisible: false });
  }

  hideHazardModal() {
    this.setState({ isHazardModalVisible: false });
  }

  //Adds Suggestion to
  addSuggestionToHazard(suggestion, suggestionType) {
    var suggestionsListObj = this.state.suggestions;

    const suggestionObj = addVisibilityToField(suggestion, true); //add Visibility Aspect to suggestions
    console.log("SUGGESTION TO BE ADDED", suggestionObj);
    if (suggestionType === "cause") {
      suggestionsListObj.causes.push(suggestionObj);
    }
    if (suggestionType === "consequence") {
      suggestionsListObj.consequences.push(suggestionObj);
    }
    if (suggestionType === "pSafeguard") {
      suggestionsListObj.preventativeSafeguards.push(suggestionObj);
    }
    if (suggestionType === "mSafeguard") {
      suggestionsListObj.mitigatingSafeguards.push(suggestionObj);
    }
  }

  /**
   * Removes suggestion from suggestion list according to the type of suggestion
   * @param {String} suggestionType type of suggestion to be removed
   * @param {Num} index index of item to be removed
   */
  deleteSuggestion(suggestionType, index) {
    var suggestionsListObj = { ...this.state.suggestions };
    if (suggestionType === "cause") {
      var cauList = deleteItemFromIndex(suggestionsListObj.causes, index);
      suggestionsListObj.causes = cauList;
    }
    if (suggestionType === "consequence") {
      var consList = deleteItemFromIndex(
        suggestionsListObj.consequences,
        index
      );
      suggestionsListObj.consequences = consList;
    }
    if (suggestionType === "pSafeguard") {
      var psList = deleteItemFromIndex(
        suggestionsListObj.preventativeSafeguards,
        index
      );
      suggestionsListObj.preventativeSafeguards = psList;
    }
    if (suggestionType === "mSafeguard") {
      var msList = deleteItemFromIndex(
        suggestionsListObj.mitigatingSafeguards,
        index
      );
      suggestionsListObj.mitigatingSafeguards = msList;
    }

    this.setState({ suggestions: suggestionsListObj });
  }

  //Save Suggestion
  saveSuggestion(suggestionType) {
    this.props.saveSuggestionsToDatabase(
      suggestionType,
      this.state.suggestions
    );
  }

  render() {
    const { data } = this.props;
    const { hazardLoaded, suggestions } = this.state;
    // console.log("Hazard Loaded", hazardLoaded.consequences[0].name);

    return (
      <div className="dw-body">
        <div className="dw-body-left-col">
          <AddNodeModal
            visible={this.state.isNodeModalVisible}
            closeModal={this.closeNodeModal}
            hideModal={this.hideNodeModal}
          />
          <AddSubnodeModal
            visible={this.state.isSubnodeModalVisible}
            hideModal={this.hideSubNodeModal}
            closeModal={this.closeSubNodeModal}
          />
          <AddHazardModal
            visible={this.state.isHazardModalVisible}
            hideModal={this.hideHazardModal}
            closeModal={this.closeHazardModal}
          />
          <Menu
            onClick={this.handleClick}
            style={{ width: "100%" }}
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            theme="dark"
          >
            <Menu.Item onClick={this.showNodeModal}>Add Node</Menu.Item>
            {data.nodes.map((node, nodeIndex) => {
              return (
                <SubMenu key={node.nodeName} title={node.nodeName}>
                  <Menu.Item
                    onClick={() => this.showSubNodeModal(node, nodeIndex)}
                  >
                    Add SubNode
                  </Menu.Item>
                  {node.subnodes.map((subnode, subnodeIndex) => {
                    return (
                      <SubMenu
                        key={node.nodeName
                          .concat(subnode.subnodeName)
                          .concat(subnodeIndex)}
                        title={subnode.subnodeName}
                      >
                        <Menu.Item
                          onClick={() =>
                            this.showHazardModal(nodeIndex, subnodeIndex)
                          }
                        >
                          Add Hazard
                        </Menu.Item>
                        {subnode.hazards.map((hazard, hazardIndex) => {
                          return (
                            <Menu.Item
                              key={node.nodeName
                                .concat(subnode.subnodeName)
                                .concat(subnodeIndex)
                                .concat(hazard.hazardName)
                                .concat(hazardIndex)}
                              onClick={() =>
                                this.updateClickedItem(
                                  node,
                                  subnode,
                                  hazard,
                                  nodeIndex,
                                  subnodeIndex,
                                  hazardIndex
                                )
                              }
                            >
                              {hazard.hazardName}
                            </Menu.Item>
                          );
                        })}
                      </SubMenu>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </div>
        <div className="dw-body-right-col">
          <div className="dw-body-right-header">
            <Button onClick={this.previous}>Previous</Button>
            <Button onClick={this.next}>Next</Button>
          </div>
          <Carousel
            className="dw-carousel-div"
            arrows={true}
            ref={(node) => (this.carousel = node)}
          >
            <h1> Hazard: {hazardLoaded.hazardName}</h1>
            <div>
              <h1>Causes</h1>
              <div className="dw-subcol">
                <div className="dw-left-subcol">
                  <Title level={3}>Suggestions</Title>
                  {hazardLoaded.causes.map((cause) => {
                    if (cause.visible) {
                      return <div>{cause.name}</div>;
                    }
                  })}
                </div>
                <div className="dw-right-subcol">
                  <Title level={3}>User Feedback</Title>
                  <div className="los-ov">
                    <div className="los-header">List of Suggestions</div>
                    <Button
                      onClick={() => this.saveSuggestion("cause")}
                      style={{ marginLeft: "auto" }}
                    >
                      Save to Database
                    </Button>
                  </div>
                  <AddSuggestionField
                    type="cause"
                    addSuggestion={this.addSuggestionToHazard}
                  />
                  {suggestions.causes.map((causeSuggestion, causeIndex) => {
                    return (
                      <DisplaySuggestionField
                        suggestion={causeSuggestion}
                        index={causeIndex}
                        type="cause"
                        deleteSuggestion={this.deleteSuggestion}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <h1>Consequences</h1>
              <div className="dw-subcol">
                <div className="dw-left-subcol">
                  <Title level={3}> Suggestions</Title>
                  {hazardLoaded.consequences.map(
                    (consequence, consequenceIndex) => {
                      if (consequence.visible) {
                        return (
                          <div className="item-ii">{consequence.name}</div>
                        );
                      }
                    }
                  )}
                </div>
                <div className="dw-right-subcol">
                  <Title level={3}>User Feedback</Title>
                  <div className="los-ov">
                    <div className="los-header">List of Suggestions</div>
                    <Button
                      onClick={() => this.saveSuggestion("consequence")}
                      style={{ marginLeft: "auto" }}
                    >
                      Save to Database
                    </Button>
                  </div>
                  <AddSuggestionField
                    type="consequence"
                    addSuggestion={this.addSuggestionToHazard}
                  />
                  {suggestions.consequences.map(
                    (consqSuggestion, consqIndex) => {
                      return (
                        <DisplaySuggestionField
                          suggestion={consqSuggestion}
                          index={consqIndex}
                          type="consequence"
                          deleteSuggestion={this.deleteSuggestion}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div>
              <h1>Preventative Safeguards</h1>
              <div className="dw-subcol">
                <div className="dw-left-subcol">
                  <Title level={3}> Suggestions</Title>
                  {hazardLoaded.preventativeSafeguards.map((pSafeguard) => {
                    if (pSafeguard.visible) {
                      return <div>{pSafeguard.name}</div>;
                    }
                  })}
                </div>
                <div className="dw-right-subcol">
                  <Title level={3}>User Feedback</Title>
                  <div className="los-ov">
                    <div className="los-header">List of Suggestions</div>
                    <Button
                      onClick={() => this.saveSuggestion("pSafeguard")}
                      style={{ marginLeft: "auto" }}
                    >
                      Save to Database
                    </Button>
                  </div>
                  <AddSuggestionField
                    type="pSafeguard"
                    addSuggestion={this.addSuggestionToHazard}
                  />
                  {suggestions.preventativeSafeguards.map(
                    (pSafeSuggestion, pSafeIndex) => {
                      return (
                        <DisplaySuggestionField
                          suggestion={pSafeSuggestion}
                          index={pSafeIndex}
                          type="pSafeguard"
                          deleteSuggestion={this.deleteSuggestion}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div>
              <h1>Mitigating Safeguards</h1>
              <div className="dw-subcol">
                <div className="dw-left-subcol">
                  <Title level={3}> Suggestions</Title>
                  {hazardLoaded.mitigatingSafeguards.map((mSafeguard) => {
                    if (mSafeguard.visible) {
                      return <div>{mSafeguard.name}</div>;
                    }
                  })}
                </div>
                <div className="dw-right-subcol">
                  <Title level={3}>User Feedback</Title>
                  <div className="los-ov">
                    <div className="los-header">List of Suggestions</div>
                    <Button
                      onClick={() => this.saveSuggestion("mSafeguard")}
                      style={{ marginLeft: "auto" }}
                    >
                      Save to Database
                    </Button>
                  </div>
                  <AddSuggestionField
                    type="mSafeguard"
                    addSuggestion={this.addSuggestionToHazard}
                  />
                  {suggestions.mitigatingSafeguards.map(
                    (mSafeSuggestion, mSafeIndex) => {
                      return (
                        <DisplaySuggestionField
                          suggestion={mSafeSuggestion}
                          index={mSafeIndex}
                          type="mSafeguard"
                          deleteSuggestion={this.deleteSuggestion}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    );
  }
}
