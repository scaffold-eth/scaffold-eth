import { Col, Row } from 'antd';
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
          <ul className="nav-menu">
            <li>
              <NavLink to="/curated">Curated</NavLink>
            </li>
            <li>
              <NavLink to={'/artist/' + address}>My Art</NavLink>
            </li>
            <li>
              <NavLink to="/holdings">Holdings</NavLink>
            </li>
          </ul>
        </Col>
        <Col>CTA</Col>
      </Row>
    </div>
  );
}

export default Navigation;
