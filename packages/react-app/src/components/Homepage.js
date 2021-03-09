import { Button } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/homepage.css';

function Homepage() {
  return (
    <div className="container">
      <div className="banner">
        <div>
          <h1 className="banner__title">Collect and create your own ethmoji</h1>
          <p className="banner__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            ante tellus, condimentum eget ante vitae, dignissim fermentum dui.
          </p>
          <p className="text-center">
            <NavLink to="/create-art">
              <Button type="primary" size="large" shape="round">
                Upload Your Art
              </Button>
            </NavLink>
            &nbsp; &nbsp; &nbsp;
            <NavLink to="/curated">
              <Button type="default" size="large" shape="round">
                View Curated Art
              </Button>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
