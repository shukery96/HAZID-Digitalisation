import React, { Component } from "react";
import axios from "axios";
import { Button, Select, Checkbox, message } from "antd";
import DisplayHazardsItem from "./DisplayHazardsItem";
import { addVisibilityElement } from "../../util/Utilities";
import LoadDataPromptPage from "../DisplayComponents/LoadDataPromptPage";

const { Option } = Select;

export default class DisplayHazardsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hazardNameParent: "",
      hazardList: [""],
      hazardAllocated: false,
      parentHazard: this.props.hazardName,
      hazardSelected: {
        id: "",
        hazardName: "Default",
        causes: ["Default"],
        consequences: ["Default"],
        preventativeSafeguards: ["Default"],
        mitigatingSafeguards: ["Default"],
      },
      savedSelection: false,
      isHazardSelected: false,
    };

    this.onChange = this.onChange.bind(this);
    this.saveHazardChoice = this.saveHazardChoice.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.toggleCheckAll = this.toggleCheckAll.bind(this);
  }

  componentDidMount() {
    //Should set this
    console.log("hazard Loaded: ", this.props.hazardName);
    this.setState({
      hazardAllocated: this.props.hazardToBeEdited.hazardAllocated,
    });
    this.setState({ hazardNameParent: this.props.hazardName });
    axios.get("http://localhost:5000/workshop/hazard").then((response) => {
      this.setState({ hazardList: response.data }, () => {
        //Update the hazardList data and everything inside to represent visibility
        const { hazardList } = this.state;
        const updateList = [];
        hazardList.forEach((hazard) => {
          var hazardObj = addVisibilityElement(hazard, false);
          updateList.push(hazardObj);
        });
        console.log("x", updateList);
        this.setState({ hazardList: updateList });
      });
    });
  }

  saveHazardChoice() {
    //Saves Choice within parent component
    message.success("Data saved to backend");
    this.setState({ savedSelection: !this.state.savedSelection });
    var updatedState = this.state.hazardSelected;
    updatedState.hazardAllocated = true;
    this.props.saveUpdatedNode(updatedState);
    // this.props.saveUpdatedNode(this.state.hazardSelected);
    //Passes Hazard to Parent Component
    // const {hazardSelected} = this.state;
    // this.props.saveHazardSelection(hazardSelected);
  }

  /**
   *  Updates when hazard box select is changed
   * @param {e} value
   */
  onChange(value) {
    this.setState({ hazardAllocated: false, savedSelection: true });

    this.setState({ isHazardSelected: true });
    console.log(`selected ${value}`);
    const { hazardList } = this.state;

    //match using the value
    hazardList.forEach((hazard) => {
      if (hazard._id === value) {
        this.setState({ hazardSelected: hazard });
      }
    });
  }

  /**
   * Toggle between checking/ unchecking everything*
   * @param {target} e Target to be modified
   * @param {String} itemType of
   */
  toggleCheckAll(e, itemType) {
    var checkAssert = e.target.checked;
    const { hazardSelected } = this.state;

    var obj = { ...hazardSelected };

    var causeList = [...hazardSelected.causes];
    var consequenceList = [...hazardSelected.consequences];
    var pSafeguardList = [...hazardSelected.preventativeSafeguards];
    var mSafeguardList = [...hazardSelected.mitigatingSafeguards];

    if (itemType === "cause") {
      causeList.forEach((item) => {
        item.visible = checkAssert;
      });
    } else if (itemType === "consequence") {
      consequenceList.forEach((item) => {
        item.visible = checkAssert;
      });
    } else if (itemType === "pSg") {
      pSafeguardList.forEach((item) => {
        item.visible = checkAssert;
      });
    } else if (itemType === "mSg") {
      mSafeguardList.forEach((item) => {
        item.visible = checkAssert;
      });
    }

    obj.causes = causeList;
    obj.consequences = consequenceList;
    obj.preventativeSafeguards = pSafeguardList;
    obj.mitigatingSafeguards = mSafeguardList;

    this.setState({ hazardSelected: obj });
  }

  /**
   * Toggles between checked and unchecked field
   * @param {string} dType type of field
   * @param {num} index of field to be modified
   */
  toggleChecked(dType, index) {
    const { hazardSelected } = this.state;
    var obj = { ...hazardSelected };

    var causesList = [...hazardSelected.causes];
    var consequenceList = [...hazardSelected.consequences];
    var pSafeguardList = [...hazardSelected.preventativeSafeguards];
    var mSafeguardList = [...hazardSelected.mitigatingSafeguards];

    if (dType === "cause") {
      causesList[index].visible = !causesList[index].visible;
      obj.causes = causesList;
    } else if (dType === "consequence") {
      consequenceList[index].visible = !consequenceList[index].visible;
      obj.consequences = consequenceList;
    } else if (dType === "pSg") {
      pSafeguardList[index].visible = !pSafeguardList[index].visible;
      obj.preventativeSafeguards = pSafeguardList;
    } else if (dType === "mSg") {
      mSafeguardList[index].visible = !mSafeguardList[index].visible;
      obj.mitigatingSafeguards = mSafeguardList;
    }

    this.setState({ hazardSelected: obj });
  }

  render() {
    //isHazardSelected - refers to the hazardBackend Reference
    const { hazardSelected, isHazardSelected } = this.state;
    var editHazardMode = !this.state.savedSelection; // if the selection is not saved(false) , edit Hazard
    const updateHazardData = this.props.hazardToBeEdited;
    const isHazardAllocated = this.state.hazardAllocated;
    // console.log("isHAZARD ALLOCATE", isHazardAllocated);

    return (
      <div className="dh-component">
        <div className="dh-header">
          <div className="dh-h1">Load Hazard Details: </div>
          <div className="dh-h2">
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a hazard"
              optionFilterProp="children"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.hazardList.map((hazard, hazardIndex) => {
                return <Option value={hazard._id}>{hazard.hazardName}</Option>;
              })}
            </Select>
            {editHazardMode ? (
              <Button
                onClick={this.saveHazardChoice}
                style={{ marginLeft: "20px" }}
              >
                {" "}
                Edit Selection
              </Button>
            ) : (
              <Button
                onClick={this.saveHazardChoice}
                style={{ marginLeft: "20px" }}
              >
                {" "}
                Save Selection
              </Button>
            )}
          </div>
        </div>
        <div
          className="dh"
          style={{ height: "70vh", backgroundColor: "white" }}
        >
          {isHazardAllocated ? (
            <div className="dh-body">
              <div className="dh-col">
                <h1 className="dh-col-header">Causes</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "cause")}>
                    Select All
                  </Checkbox>
                </div>

                {updateHazardData.causes.map((cause, cIndex) => {
                  return (
                    <DisplayHazardsItem
                      item={cause}
                      index={cIndex}
                      dType="cause"
                      isDisabled={true}
                      toggleChecked={this.toggleChecked}
                    />
                  );
                })}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Consequences</h1>
                <div className="dh-checkbox">
                  <Checkbox
                    onChange={(e) => this.toggleCheckAll(e, "consequence")}
                  >
                    Select All
                  </Checkbox>
                </div>

                {updateHazardData.consequences.map((consequence, cIndex) => {
                  return (
                    <DisplayHazardsItem
                      item={consequence}
                      index={cIndex}
                      dType="consequence"
                      isDisabled={true}
                      toggleChecked={this.toggleChecked}
                    />
                  );
                })}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Preventative Safeguards</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "pSg")}>
                    Select All
                  </Checkbox>
                </div>

                {updateHazardData.preventativeSafeguards.map(
                  (preventativeSafeguard, pIndex) => {
                    return (
                      <DisplayHazardsItem
                        item={preventativeSafeguard}
                        index={pIndex}
                        dType="pSg"
                        isDisabled={true}
                        toggleChecked={this.toggleChecked}
                      />
                    );
                  }
                )}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Mitigating Safeguards</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "mSg")}>
                    Select All
                  </Checkbox>
                </div>

                {updateHazardData.mitigatingSafeguards.map(
                  (mitigatingSafeguard, mIndex) => {
                    return (
                      <DisplayHazardsItem
                        item={mitigatingSafeguard}
                        index={mIndex}
                        dType="mSg"
                        isDisabled={true}
                        toggleChecked={this.toggleChecked}
                      />
                    );
                  }
                )}
              </div>
            </div>
          ) : null}
          {!isHazardSelected ? (
            isHazardAllocated ? null : (
              <LoadDataPromptPage />
            )
          ) : (
            <div className="dh-body">
              <div className="dh-col">
                <h1 className="dh-col-header">Causes</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "cause")}>
                    Select All
                  </Checkbox>
                </div>

                {hazardSelected.causes.map((cause, cIndex) => {
                  return (
                    <DisplayHazardsItem
                      item={cause}
                      index={cIndex}
                      dType="cause"
                      toggleChecked={this.toggleChecked}
                    />
                  );
                })}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Consequences</h1>
                <div className="dh-checkbox">
                  <Checkbox
                    onChange={(e) => this.toggleCheckAll(e, "consequence")}
                  >
                    Select All
                  </Checkbox>
                </div>

                {hazardSelected.consequences.map((consequence, cIndex) => {
                  return (
                    <DisplayHazardsItem
                      item={consequence}
                      index={cIndex}
                      dType="consequence"
                      toggleChecked={this.toggleChecked}
                    />
                  );
                })}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Preventative Safeguards</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "pSg")}>
                    Select All
                  </Checkbox>
                </div>

                {hazardSelected.preventativeSafeguards.map(
                  (preventativeSafeguard, pIndex) => {
                    return (
                      <DisplayHazardsItem
                        item={preventativeSafeguard}
                        index={pIndex}
                        dType="pSg"
                        toggleChecked={this.toggleChecked}
                      />
                    );
                  }
                )}
              </div>
              <div className="dh-col">
                <h1 className="dh-col-header">Mitigating Safeguards</h1>
                <div className="dh-checkbox">
                  <Checkbox onChange={(e) => this.toggleCheckAll(e, "mSg")}>
                    Select All
                  </Checkbox>
                </div>

                {hazardSelected.mitigatingSafeguards.map(
                  (mitigatingSafeguard, mIndex) => {
                    return (
                      <DisplayHazardsItem
                        item={mitigatingSafeguard}
                        index={mIndex}
                        dType="mSg"
                        toggleChecked={this.toggleChecked}
                      />
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
