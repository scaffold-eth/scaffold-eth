import { Menu, Tooltip } from "antd";

import { Link, useLocation } from "react-router-dom";
import Account from "./Account";
import ContractIcon from "./Icons/ContractIcon";
import GuideIcon from "./Icons/GuideIcon";
import HomeIcon from "./Icons/HomeIcon";
import LogoIcon from "./Icons/LogoIcon";
import LoogieIcon from "./Icons/LoogieIcon";
import LoogieNavIcon from "./Icons/LoogieNavIcon";

import "./Navbar.css";

export default function NavBar({
  useBurner,
  address,
  localProvider,
  userSigner,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
}) {
  const location = useLocation();

  return (
    <div className="navbar">
      <div>
        <LoogieIcon className="navbar__loogie-logo" />
        <Menu selectedKeys={[location.pathname]} mode="horizontal" className="navbar__menu">
          <Menu.Item key="/" className="navbar__menu-item">
            <Link to="/" className="navbar__link navbar__menu-item-desktop-content">
              Home
            </Link>
            <Tooltip title="Home" className="navbar__menu-item-mobile-content">
              <Link to="/" className="navbar__link">
                <HomeIcon />
              </Link>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="/yourLoogies" className="navbar__menu-item">
            <Link to="/yourLoogies" className="navbar__link navbar__menu-item-desktop-content">
              Your Loogies
            </Link>
            <Tooltip title="Your Loogies" className="navbar__menu-item-mobile-content">
              <Link to="/yourLoogies" className="navbar__link">
                <LoogieNavIcon />
              </Link>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="/guide" className="navbar__menu-item">
            <Link to="/guide" className="navbar__link navbar__menu-item-desktop-content">
              Guide
            </Link>
            <Tooltip title="Guide" className="navbar__menu-item-mobile-content">
              <Link to="/guide" className="navbar__link">
                <GuideIcon />
              </Link>
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="/contracts" className="navbar__menu-item">
            <Link to="/contracts" className="navbar__link navbar__menu-item-desktop-content">
              Contracts
            </Link>
            <Tooltip title="Contracts" className="navbar__menu-item-mobile-content">
              <Link to="/contracts" className="navbar__link">
                <ContractIcon />
              </Link>
            </Tooltip>
          </Menu.Item>
        </Menu>
      </div>

      <div className="navbar__logo">
        <Link to="/">
          <LogoIcon />
        </Link>
      </div>

      <Account
        useBurner={useBurner}
        address={address}
        localProvider={localProvider}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        connectButtonStyles="lg"
      />
    </div>
  );
}
