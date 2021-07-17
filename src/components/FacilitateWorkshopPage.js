import React, { Component } from "react";
import FacilitatorCard from "./TableComponents/FacilitatorCard";
import axios from "axios";
import "../FacilitatorPage.css";

var de = false;

export default class FacilitateWorkshopPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    console.log("Facilitate Workshop Instance");
    axios.get("http://localhost:5000/workshop/").then((response) => {
      de && console.log("fetch Data", response.data);
      this.setState({ data: response.data });
    });
    // this.timer = setInterval(() => this.loadData(), 500);
  }
  /**
   * Fetch Data from Backend
   */
  //   loadData() {
  //     axios.get("http://localhost:5000/workshop/").then((response) => {
  //       console.log(response.data);
  //       this.setState({ data: response.data });
  //     });
  //   }

  render() {
    return (
      <div className="facilitator-workshop-page">
        <div className="fwp-title">
          <h1>List of Workshops </h1>
        </div>

        <div className="card-list">
          {this.state.data.map((workshop) => {
            return <FacilitatorCard data={workshop} key={workshop._id} />;
          })}
        </div>
      </div>
    );
  }
}
