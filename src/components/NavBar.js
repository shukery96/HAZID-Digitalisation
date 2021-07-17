import React, { Component } from "react";
import { Link } from "react-router-dom";
import UserProfileDrawer from "./UserProfileDrawer";
import { Menu, Button } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";

export default class NavBar extends Component {
  state = { drawerVisible: false };

  showDrawer = () => {
    this.setState({ drawerVisible: true });
    console.log("Show Drawer");
  };

  onClose = () => {
    this.setState({ drawerVisible: false });
  };
  render() {
    return (
      <div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item icon={<AppstoreOutlined />}>
            <Link to="/">Home Page</Link>
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />}>
            <Link to="/FacilitateWorkshopPage">Facilitate Workshop</Link>
          </Menu.Item>
          <Menu.Item icon={<UserOutlined />}>
            <Link to="/WorkshopCreationPage">Create Workshop</Link>
          </Menu.Item>
          <Menu.Item>
            <Button type="primary" onClick={this.showDrawer}>
              <PlusOutlined /> User Details
            </Button>
          </Menu.Item>
        </Menu>
        <UserProfileDrawer
          drawerVisible={this.state.drawerVisible}
          onClose={this.onClose}
        />
      </div>
    );
  }
}
