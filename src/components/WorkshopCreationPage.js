import React, { Component } from "react";
import { Layout, Button } from "antd";
import {
  PlusOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import WorkshopModal from "./modalComponents/CreateWorkshopModal";
import WorkshopTable from "./WorkshopTable";
import { Link } from "react-router-dom";

export default class WorkshopCreationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    console.log("Workshop Creation Page");
  }

  /**
   * Displays New Workshop Modal
   */
  showModal = () => {
    this.setState({ modalVisible: true });
  };

  /**
   * Hides New Workshop Modal
   */
  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    return (
      <Layout>
        <div className="workshop-creation-page">
          <WorkshopModal
            visible={this.state.modalVisible}
            closeModal={this.hideModal}
          />
          <div className="wcp-header">
            <div className="wcp-header-title" level={2}>
              <div className="wcp-header-title-font">Workshop Creation</div>
            </div>
            <div className="wcp-header-button-list">
              <Button
                className="wcp-header-button-item"
                type="primary"
                onClick={this.showModal}
              >
                <PlusOutlined />
                New Workshop
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: "20px", color: "white" }}
              >
                <CloudUploadOutlined />
                <Link
                  style={{ color: "white" }}
                  to={{
                    pathname: "/WorkshopCreationPage/UploadData",
                  }}
                >
                  Load Backend{" "}
                </Link>
              </Button>

              <Button
                type="primary"
                style={{ marginLeft: "20px", color: "white" }}
              >
                <Link
                  style={{ color: "white" }}
                  to={{
                    pathname: "/WorkshopCreationPage/EditHazardsPage",
                  }}
                >
                  <EditOutlined />
                  Edit Hazards
                </Link>
              </Button>
            </div>
          </div>

          <WorkshopTable />
        </div>
      </Layout>
    );
  }
}
