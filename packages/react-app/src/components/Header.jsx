import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import React from "react";

// displays a page header

export default function Header() {
  const location = useLocation();

  return (
    <div id="page-header">
      <a href="/">
        <div style={{ display: "flex", marginLeft: 20, paddingTop: 10 }}>
          <span class="ant-avatar ant-avatar-circle ant-avatar-image">
            <img alt="LoogieShip" src="/images/ship-logo.svg" />
          </span>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "right", marginLeft: 15 }}>
            <span
              title="SailorLoogies"
              style={{ fontFamily: "'Pirata One', cursive", fontSize: 50, color: "#603813", height: 50 }}
            >
              SailorLoogies
            </span>
            <span
              title="FancyLoogies go fishing"
              style={{ color: "#c59b6d", fontFamily: "'Pirata One', cursive", fontSize: 24, height: 24, marginTop: 15 }}
            >
              FancyLoogies go fishing
            </span>
          </div>
        </div>
      </a>
      <Menu
        id="menu"
        selectedKeys={[location.pathname]}
        mode="horizontal"
      >
        <Menu.Item key="/">
          <Link to="/">App Home</Link>
        </Menu.Item>
        <Menu.Item key="/yourShips">
          <Link to="/yourShips">Your LoogieShips</Link>
        </Menu.Item>
        <Menu.Item key="/ranking">
          <Link to="/ranking">Ranking</Link>
        </Menu.Item>
        <Menu.Item key="/prizes">
          <Link to="/prizes">Prizes</Link>
        </Menu.Item>
        <Menu.Item key="/fishing">
          <Link to="/fishing">Fishing Log</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}
