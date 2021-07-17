import React, { Component } from "react";
import { Table, Tag, Space, Popconfirm, message } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
// import { CloudFilled,PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";

export default class WorkshopTable extends Component {
  data = [
    {
      _id: "",
      workshopName: "",
      nodes: [],
      tags: [],
    },
  ];

  constructor(props) {
    super(props);

    this.state = {
      data: this.data,
    };
  }

  componentDidMount() {
    console.log("Workshop Table Instance");
    this.timer = setInterval(() => this.loadData(), 500);
  }

  /**
   * Fetch Data from Backend
   */
  loadData() {
    axios.get("http://localhost:5000/workshop/").then((response) => {
      this.setState({ data: response.data });
    });
  }

  /**
   * Deletes workshop from database
   * @param {string} workshopID of workshop to be deleted
   */
  deleteWorkshop(workshopID) {
    axios
      .delete("http://localhost:5000/workshop/" + workshopID)
      .then((response) => {
        console.log(response.data);
      });
  }

  /**
   * Confirmation message to delete object from Backend
   * @param {Object} workshop  object to be deleted
   */
  confirmWorkshopDeletion = (workshop) => {
    console.log("Deletion Confirmed");
    const workshopName = workshop.workshopName;
    message.success(workshopName + " Workshop Deleted");
    this.deleteWorkshop(workshop._id);
  };

  cancelWorkshopDeletion(e) {
    console.log(e);
  }

  render() {
    let columns = [
      {
        title: "Workshop Name",
        dataIndex: "workshopName",
        key: "workshopName",
        render: (text) => <a href="#/">{text}</a>,
      },
      {
        title: "Tags",
        dataIndex: "tags",
        key: "tags",
        render: (tags) => (
          <>
            {tags.map((tag) => {
              let color = "grey";
              if (tag === "completed") {
                color = "green";
              } else {
                color = "volcano";
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text, workshop) => (
          <Space size="middle">
            <Link
              to={{
                pathname: "/WorkshopCreationPage/EditWorkshop",
                state: { workshop: workshop },
              }}
            >
              Edit {workshop.workshopName}
            </Link>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={() => this.confirmWorkshopDeletion(workshop)}
              onCancel={this.cancelWorkshopDeletion}
              okText="Yes"
              cancelText="No"
            >
              <a href="#/">Delete</a>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          expandable={{
            expandedRowRender: (record, index) =>
              record.nodes.map((x) => <p key={x._id}>{x.nodeName}</p>),
          }}
          rowKey="_id"
        />
      </div>
    );
  }
}
