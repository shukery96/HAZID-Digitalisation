import React, { Component } from "react";
import "../../FacilitatorPage.css";
import { Menu, Carousel, Typography } from "antd";
import Card from "@material-ui/core/Card";
import AddNodeModal from "../EditWorkshopComponents/AddNodeModal";
import AddSubnodeModal from "../EditWorkshopComponents/AddSubnodeModal";
import AddHazardModal from "../EditWorkshopComponents/AddHazardWithOptionsModal";
import AddSuggestionField from "./AddSuggestionField";
import DisplaySuggestionField from "./DisplaySuggestionField";
import {
  deleteItemFromIndex,
  addVisibilityToField,
} from "../../util/Utilities";
import grid from '../../grid.jpg';
import axios from 'axios';
import { CardContent, List, ListItem, Button, TextField } from "@material-ui/core";

const { SubMenu } = Menu;
const { Title } = Typography;

const cardStyle = {
  display: 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  width: '70%',
  'box-shadow': '0 7px 5px -5px #777',
  'margin-bottom': '10px', 
  'padding-bottom': '10px',
  'padding-left': '10px',
  'padding-right': '10px',
  'margin-top': '10px', 
}

const cardStyle2 = {
  display: 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  width: '100%',
  'box-shadow': '0 7px 5px -5px #777',
  'margin-bottom': '10px', 
  'padding-bottom': '10px',
  'padding-left': '10px',
  'padding-right': '10px',
  'margin-top': '10px', 
}

const padding = {
  'padding-bottom': '10px'
}

const listStyle = {
  display:'inline-block',
  'text-align':'center',
}

function arrayfy(suggestion) {
  const arr = []
  for(const i in suggestion) {
    arr.push(suggestion[i].name)
  }
  return arr
}

function Historycard(props) {
  console.log("props.suggestion: ", props.suggestion, ", typeof:", typeof(props.suggestion))
  const arr = arrayfy(props.suggestion);
  if(props.suggestionType === "hazardName" || props.suggestion === []) {
    return <Card style={cardStyle2}>
            <CardContent>
              <Typography variant='h1' style={{ fontWeight: 800 }}>
                {props.suggestionType}
              </Typography>
              <Typography variant='h4'>
                {props.suggestion}
              </Typography>
            </CardContent>
           </Card>;
  } else {
    return <Card style={cardStyle2}>
            <CardContent>
              <Typography variant='h1' style={{ fontWeight: 800 }}>
                {props.suggestionType}
              </Typography>
              <List style={listStyle}>
                {arr.map(item => {
                  return <ListItem style={listStyle}>{item}</ListItem>;
                })}
              </List>
            </CardContent>
           </Card>;
  }

}

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
        analysis: "",
      },
      isNodeModalVisible: false,
      isSubnodeModalVisible: false,
      nodeIndexToAddSubnode: 0,
      isHazardModalVisible: false,
      subnodeIndexToAddHazard: 0,
      isHazardAllocated: false,
      selectedGridFile: grid
    };

    this.handlePhotoChange = this.handlePhotoChange.bind(this)

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

  handlePhotoChange(event) {
    this.setState({
      selectedGridFile: URL.createObjectURL(event.target.files[0])
    })
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
    console.log("addSuggestiontoHazard")
    console.log(suggestion)
    console.log(suggestionType)
    console.log("Causes", this.state.suggestions.causes)
    // this.setState((state) => {
    //   return {causes: suggestion}
    // });

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

  choices(type, suggestions) {
    var typeName = ""
    var indexName = {}
    if(type === "cause") {
      typeName = "Causes"
      indexName = 
      (suggestions.causes.map((causeSuggestion, causeIndex) => {
        return (
          <DisplaySuggestionField
            suggestion={causeSuggestion}
            index={causeIndex}
            type={type}
            deleteSuggestion={this.deleteSuggestion}
          />
        );
      }))
    } else if (type == "consequence") {
      typeName = "Consquences"
      indexName = 
      (suggestions.consequences.map(
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
      ))
    } else if (type == "pSafeguard") {
      typeName = "Preventative Safeguards"
      indexName = 
      (suggestions.preventativeSafeguards.map(
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
      ))
    } else if (type == "mSafeguard") {
      typeName = "Mitigating Safeguards"
      indexName = 
      (suggestions.mitigatingSafeguards.map(
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
      ))
    }
    return (
      <Card style={cardStyle}>
        <h3>{typeName}</h3>
        <div className="los-ov">
          <div className="los-header">List of Suggestions</div>
            <Button
              onClick={() => this.saveSuggestion(type)}
              style={{ marginLeft: "auto" }}
            >
              Save to Database
            </Button>
          </div>
          <AddSuggestionField
            type={type}
            addSuggestion={this.addSuggestionToHazard}
          />
          {indexName}
      </Card>
    );
  }

  handleAnalysisChange(event) {
    const { suggestions } = this.state;
    const newSuggestions = {
      causes: suggestions.causes,
      consequences: suggestions.consequences,
      preventativeSafeguards: suggestions.preventativeSafeguards,
      mitigatingSafeguards: suggestions.mitigatingSafeguards,
      analysis: event.target.value,
    }
    this.setState({suggestions: newSuggestions});
  }

  render() {
    const { data } = this.props;
    const { hazardLoaded, suggestions } = this.state;
    // console.log("Hazard Loaded", hazardLoaded.consequences[0].name);
    // console.log("Hazard Loaded: ", this.state.hazardLoaded);

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
          <h1><u><b>{hazardLoaded.hazardName}</b></u></h1>
          <div className="dw-body-right-header">
            <Button className="sliderButton" variant="contained" color="secondary" onClick={this.previous}>Previous</Button>
            <Button className="sliderButton" variant="contained" color="secondary" onClick={this.next}>Next</Button>
          </div>
          <Carousel
            className="dw-carousel-div"
            arrows={true}
            ref={(node) => (this.carousel = node)}
          >
            <div className="firstPage">
              {this.choices("cause", suggestions)}
            </div>
            <div className ="firstPage">
              {this.choices("consequence", suggestions)} 
              {this.choices("cause", suggestions)}
            </div> 
            <div className ="firstPage">
              {this.choices("pSafeguard", suggestions)}  
              {this.choices("consequence", suggestions)}
              {this.choices("cause", suggestions)}
            </div> 
            <div className ="firstPage">
              {this.choices("mSafeguard", suggestions)}  
              {this.choices("pSafeguard", suggestions)}  
              {this.choices("consequence", suggestions)}
              {this.choices("cause", suggestions)}
            </div> 
            <div className="dw-body-right-last">
              <div className="dw-body-right-last-left">
                <div><Historycard suggestion={this.state.hazardLoaded.hazardName} suggestionType="hazardName"/></div>
                <div><Historycard suggestion={this.state.suggestions.causes} suggestionType="Causes"/></div>
                <div><Historycard suggestion={this.state.suggestions.consequences} suggestionType="Consequences"/></div>
                <div><Historycard suggestion={this.state.suggestions.preventativeSafeguards} suggestionType="Preventative Safeguards"/></div>
                <div><Historycard suggestion={this.state.suggestions.mitigatingSafeguards} suggestionType="Mitigating Safeguards"/></div>
              </div>
              <div className="dw-body-right-last-right">
                <Card style={cardStyle2} className="dw-body-right-last-right-text">
                  <input style={padding} type="file" onChange={this.handlePhotoChange}/>
                  <img style={padding}src={this.state.selectedGridFile} alt="Grid Image" width="100%"/>
                  <TextField
                    id="outlined-multiline-static"
                    label="Analysis"
                    multiline
                    rows={4}
                    placeholder="Analysis"
                    variant="outlined"
                    fullWidth
                    value={this.state.suggestions.analysis} 
                    onChange={this.handleAnalysisChange.bind(this)}
                    style={padding}
                  />
                  <Button
                    onClick={() => this.saveSuggestion("analysis")}
                  >
                    Save to Database
                  </Button>
                </Card>
              </div>
            </div>   
          </Carousel>   
        </div>
      </div>
    );
  }
}

