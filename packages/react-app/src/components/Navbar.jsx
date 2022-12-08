import { Menu } from "antd";

import { Link, useLocation } from "react-router-dom";
import Account from "./Account";

// Temporary
const MENU_STYLES = { borderBottom: 0, fontWeight: 700 };
const MENU_ITEM_STYLES = { borderBottom: 0, lineHeight: "80px" };
const WRAPPER_STYLES = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingRight: "1.2rem",
};

export default function NavBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) {
  const location = useLocation();

  return (
    <div style={WRAPPER_STYLES}>
      <Menu selectedKeys={[location.pathname]} mode="horizontal" style={MENU_STYLES}>
        <Menu.Item key="/" style={MENU_ITEM_STYLES}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/yourLoogies" style={MENU_ITEM_STYLES}>
          <Link to="/yourLoogies">Your Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/guide" style={MENU_ITEM_STYLES}>
          <Link to="/guide">Guide</Link>
        </Menu.Item>
        <Menu.Item key="/contracts" style={MENU_ITEM_STYLES}>
          <Link to="/contracts">Contracts</Link>
        </Menu.Item>
      </Menu>
      <Account
        minimized={true}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
    </div>
  );
}
