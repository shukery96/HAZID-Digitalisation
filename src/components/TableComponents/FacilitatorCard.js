import React, { Component } from "react";
import "../../FacilitatorPage.css";
import { Button, Checkbox } from "antd";
import { Link } from "react-router-dom";
import "../../FacilitatorPage.css";
import axios from "axios";

export default class FacilitatorCard extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.exportToExcel = this.exportToExcel.bind(this);
  }

  onStartWorkshop() {
    console.log("Start Workshop");
  }

  exportToExcel() {
    // console.log("Export to excel", this.props.data);
    axios
      .post("http://localhost:5000/workshop/exportToExcel", this.props.data, {
        responseType: "blob",
      })
      .then((response) => {
        let headerLine = response.headers["content-disposition"];
        let startFileNameIndex = headerLine.indexOf('"') + 1;
        let endFileNameIndex = headerLine.lastIndexOf('"');
        let filename = headerLine.substring(
          startFileNameIndex,
          endFileNameIndex
        );
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div className="card">
        <div className="fc-card-col-left">
          <div className="fc-card-checkbox-overview">
            <div className="fc-checkbox-title">Display Workshop</div>
            <div className="fc-checkbox-button">
              <Checkbox stule={{ margintTop: "5px" }} />
            </div>
          </div>
          <div className="fc-card-button-overview">
            <Button>
              <Link
                to={{
                  pathname: "/FacilitateWorkshopPage/DisplayWorkshop/",
                  state: { data: this.props.data },
                }}
              >
                Start Workshop
              </Link>
            </Button>
            <Button onClick={this.exportToExcel}>Export to excel</Button>
          </div>
        </div>
        <div className="fc-card-col-right">
          <div className="fc-card-right-header">
            <div className="fc-header-card">
              <div className="fc-workshop-name">{data.workshopName}</div>
              <div className="fc-workshop-id">ID: {data._id}</div>
            </div>
          </div>
          <div className="fc-card-right-footer">
            <div className="fc-footer-card">
              <div className="fc-footer-col-1">
                <div className="fc-footer-header">Status</div>
                <div className="fc-col-content">Completed</div>
              </div>
              <div className="fc-footer-col-2">
                <div className="fc-footer-header">Nodes</div>
                <div className="fc-col-content">
                  {data.nodes.map((node, nodeIndex) => {
                    if (nodeIndex <= 2) {
                      return <div key={nodeIndex}>- {node.nodeName}</div>;
                    }
                  })}
                </div>
              </div>
              <div className="fc-footer-col-3">
                <div className="fc-footer-header">Date Hosted</div>
                <div className="fc-col-content">12/22/2021</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
