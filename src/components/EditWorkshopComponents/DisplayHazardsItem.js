import React, { Component } from "react";
import { Checkbox } from "antd";

export default class DisplayHazardsItem extends Component {
  constructor(props) {
    super(props);

    this.checkItem = this.checkItem.bind(this);
    this.updateChecked = this.updateChecked.bind(this);
  }

  onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  checkItem() {
    console.log("Parents called child");
    this.setState({ checked: true });
  }

  updateChecked() {
    // console.log("updateChecked: ", this.props.index, this.props.dType);
    const { dType, index } = this.props;
    this.props.toggleChecked(dType, index);
  }

  render() {
    return (
      <div className="dhi-box">
        <div className="dh-item-content">{this.props.item.name}</div>

        <Checkbox
          onChange={this.onChange}
          checked={this.props.item.visible}
          disabled={this.props.isDisabled}
          onClick={this.updateChecked}
          style={{ marginLeft: "auto", marginRight: "5px" }}
        />
      </div>
    );
  }
}
