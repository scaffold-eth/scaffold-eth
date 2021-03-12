import { Button, Col, Row } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigation.css';

function Navigation({ address }) {
  return (
    <header className="site-nav">
      <Row align="middle" justify="space-between">
        <Col xs={24} lg={12}>
          <div className="logo">
            <NavLink to="/">Logo</NavLink>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="nav-menu-wrapper flex-center">
            <ul className="nav-menu">
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
          </div>
        </Col>
      </Row>
    </header>
  );
}

export default Navigation;
