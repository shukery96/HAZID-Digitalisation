import React, { Component } from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons";
import { CompareObjects } from "../util/JSONHandler";
import { addVisibilityToWorkshop } from "../util/Utilities";
import DisplayUploadData from "./DisplayComponents/DisplayUploadData";
import axios from "axios";

//Used to Upload Data from a metadata file
export default class UploadDataPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonData: { workshopName: " [Upload Data]", nodes: [] },
    };

    this.fileHandler = this.fileHandler.bind(this);
    this.onButtonRemove = this.onButtonRemove.bind(this);
    this.onClickSaveToBackend = this.onClickSaveToBackend.bind(this);
  }

  /**
   * Clears jsonData when a file is removed
   */
  onButtonRemove() {
    this.setState({ jsonData: { workshopName: "---", nodes: [] } });
  }

  /**
   * Saves uploaded data to backend
   */
  onClickSaveToBackend() {
    // console.log("Data before being transformed", this.state.jsonData);

    var workshopVisible = addVisibilityToWorkshop(this.state.jsonData, true); //Adds visible element to each hazard in the workshop, sets true default
    // console.log("Workshop with visibility element: ", workshopVisible);

    if (this.state.jsonData.nodes.length !== 0) {
      axios.post("http://localhost:5000/workshop/addWorkshop", workshopVisible);

      message.success({
        content: "Successfully saved to database",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
    } else {
      message.error({
        content: "Please upload data before saving in the database",
        className: "custom-class",
        style: {
          marginTop: "20vh",
        },
      });
    }
  }

  /**
   * Checks through the validity of the file prior to uploading the data to the database e.g format, fields
   * @param {*} fileList
   * @returns
   */
  fileHandler(fileList) {
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({ errorMessage: "No file uploaded" });
      return false;
    }

    if (!(fileObj.type === "application/json")) {
      this.setState({
        errorMessage: "Unknown file format. Only JSON files are uploaded",
      });
      return false;
    }

    const reader = new FileReader();

    //Async function
    reader.onload = (e) => {
      var JSONdata = JSON.parse(e.target.result);

      //Checks keys within the file
      if (CompareObjects(JSONdata)) {
        this.setState({ jsonData: JSONdata });
      } else {
        alert("upload failed due to improper data structure");

        return false;
      }
    };
    reader.readAsText(fileObj);
    console.log("Reading file as text");
    return false;
  }

  render() {
    //property for the Upload Tag
    const props = {
      name: "file",
      headers: {
        authorization: "authorization-text",
      },
      accept: ".json", //asserts the json file format
      beforeUpload: this.fileHandler,
      onChange(info) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    // console.log("JSON Data in Render: ", this.state.jsonData);
    return (
      <div className="upload-data-page">
        <div className="udp-header">
          <div className="udp-header-title">Upload MetaData To Database </div>
          <div className="udp-header-content">
            <h3 className="udp-header-subtitle">
              Upload Workshop Data [JSON]:{" "}
            </h3>
            <Upload {...props} onRemove={this.onButtonRemove}>
              <Button
                icon={<UploadOutlined />}
                className="udp-header-content-button"
              >
                Click to Upload
              </Button>
            </Upload>
            <div className="udp-header-content-button">
              <Button
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: "#a0d911",
                  color: "white",
                  fontWeight: "10px",
                }}
                onClick={this.onClickSaveToBackend}
              >
                Save To Database
              </Button>
            </div>
            <div className="udp-header-content-button">
              <Button
                icon={<EyeOutlined />}
                style={{
                  backgroundColor: "#91d5ff",
                  color: "white",
                  fontWeight: "10px",
                }}
                // onClick={this.showSomeDataFormat}
              >
                View Sample Format
              </Button>
            </div>
          </div>
          <br />
        </div>

        <div className="udp-body">
          {this.state.jsonData.length !== 0 ? (
            <DisplayUploadData data={this.state.jsonData} />
          ) : (
            <div>Please Upload Data</div>
          )}
        </div>
      </div>
    );
  }
}
