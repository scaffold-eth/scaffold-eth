import { Button, Col, Row } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigation.css';

function Navigation({ address }) {
  return (
    <div className="site-nav">
      <Row align="middle" justify="space-between">
        <Col>
          <NavLink to="/">Logo</NavLink>
        </Col>
        <Col>
          <div className="flex-center">
            <ul className="nav-menu">
              <li>
                <NavLink to="/curated">Curated Art</NavLink>
              </li>
              <li>
                <NavLink to={'/artist/' + address}>My Art</NavLink>
              </li>
              <li>
                <NavLink to="/holdings">Holdings</NavLink>
              </li>
            </ul>
            <NavLink to="/create-art">
              <Button type="primary" size="large" shape="round">
                Upload Your Art
              </Button>
            </NavLink>
            &nbsp; &nbsp;
            <Button type="default" size="large" shape="round">
              Connect Wallet
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Navigation;
