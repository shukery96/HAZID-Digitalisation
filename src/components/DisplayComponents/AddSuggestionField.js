import React, { Component } from "react";
import { capitalizeFirstLetter, isEmptyString } from "../../util/Utilities";
import { Input, Button, Alert } from "antd";
import { RiAddLine } from "react-icons/ri";

export default class AddSuggestionField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userSuggestion: "",
      isEmptySuggestion: false,
    };

    this.updateSuggestion = this.updateSuggestion.bind(this);
    this.saveSuggestion = this.saveSuggestion.bind(this);
  }

  updateSuggestion = (e) => {
    //     console.log("test");
    this.setState(
      { userSuggestion: e.target.value, isEmptySuggestion: false },
      () => {
        // console.log("User Suggestion:", this.state.userSuggestion);
      }
    );
  };

  //OnClick Enter /Add button
  saveSuggestion() {
    //this.props.data
    const { userSuggestion } = this.state;
    if (!isEmptyString(userSuggestion)) {
      this.props.addSuggestion(userSuggestion, this.props.type);
    } else {
      this.setState({ isEmptySuggestion: true });
    }
  }

  render() {
    var type = this.props.type;
    if (type === "pSafeguard") {
      type = "Preventative Safeguard";
    }
    if (type === "mSafeguard") {
      type = "Mitigating Safeguard";
    }

    var inputFieldPlaceHolder = "Add " + capitalizeFirstLetter(type);
    const { isEmptySuggestion } = this.state;
    return (
      <div className="suggestion-overview">
        {isEmptySuggestion ? (
          <Alert
            message="Please enter a valid suggestion"
            type="error"
            closable
          />
        ) : null}
        <div className="suggestion-field">
          <Input
            placeholder={inputFieldPlaceHolder}
            onChange={this.updateSuggestion}
            allowClear
          />
          <Button onClick={this.saveSuggestion}>
            <RiAddLine
              style={{
                marginTop: "3px",
              }}
            />
            Add
          </Button>
        </div>
      </div>
    );
  }
}
