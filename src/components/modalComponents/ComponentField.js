//For each component

import React, { Component } from "react";
import { InputNumber, Button, Popconfirm } from "antd";
import { DeleteOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";

export default class ComponentField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      noSubComponents: 1,
    };
  }

  onChangeNoSubcomponents = (value) => {
    this.setState({ noSubComponents: value });
    //Associate noSubComponents with parent component
    this.props.updateNoSubcomponents(this.props.index, value);
  };

  //Delete Component
  confirmComponentDeletion = (index) => {
    console.log("Component Deletion: ", index);
    this.props.componentDeletion(index);
  };

  render() {
    return (
      <div>
        <div className="componentTitle" style={{ fontWeight: "bold" }}>
          {" "}
          {/* {this.props.component} */}
          {this.props.component.componentName}
          {this.props.component.noSubcomponents}
        </div>

        <div
          className="subcomponent-number"
          style={{
            display: "flex",
            flexDirection: "row",
            // border: "1px solid black",
          }}
        >
          No of Subcomponents:
          <InputNumber
            min={1}
            max={10}
            defaultValue={1}
            onChange={this.onChangeNoSubcomponents}
            style={{ marginLeft: "20px" }}
          />
          <Button
            type="dashed"
            icon={<UpOutlined />}
            size="medium"
            onClick={() =>
              this.props.swapComponentsWithPrevious(this.props.index)
            }
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              marginLeft: "20px",
            }}
          />
          <Button
            type="dashed"
            icon={<DownOutlined />}
            size="medium"
            onClick={() => this.props.swapComponentsWithNext(this.props.index)}
            style={{
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              marginLeft: "20px",
            }}
          />
          <Popconfirm
            title="Are you sure to delete this component?"
            onConfirm={() => this.confirmComponentDeletion(this.props.index)}
            // onCancel={this.cancelComponent}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="dashed"
              icon={<DeleteOutlined />}
              size="medium"
              style={{
                justifyContent: "flex-end",
                alignSelf: "flex-end",
                marginLeft: "20px",
              }}
            />
          </Popconfirm>
        </div>
      </div>
    );
  }
}
