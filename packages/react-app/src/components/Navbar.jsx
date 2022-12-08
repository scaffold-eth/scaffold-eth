import { Menu } from "antd";

import { Link, useLocation } from "react-router-dom";
import Account from "./Account";
import Logo from "./Icons/Logo";

import "./Navbar.css";

export default function NavBar({ web3Modal, loadWeb3Modal, logoutOfWeb3Modal }) {
  const location = useLocation();

  return (
    <div className="navbar">
      <Menu selectedKeys={[location.pathname]} mode="horizontal" className="navbar__menu">
        <Menu.Item key="/" className="navbar__menu-item">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/yourLoogies" className="navbar__menu-item">
          <Link to="/yourLoogies">Your Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/guide" className="navbar__menu-item">
          <Link to="/guide">Guide</Link>
        </Menu.Item>
        <Menu.Item key="/contracts" className="navbar__menu-item">
          <Link to="/contracts">Contracts</Link>
        </Menu.Item>
      </Menu>

      <div className="navbar__logo">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      <Account
        minimized={true}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        connectButtonStyles="lg"
      />
    </div>
  );
}
