import { Button } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import CuratedInks from '../CuratedInks';
import '../styles/homepage.css';

function Homepage({ localProvider, injectedProvider }) {
  return (
    <div className="container">
      <div className="banner">
        <div>
          <h1 className="banner__title">Collect and create your own NFT Art</h1>
          <p className="banner__description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            ante tellus, condimentum eget ante vitae, dignissim fermentum dui.
          </p>
          <p className="text-center">
            <NavLink to="/create-art">
              <Button type="primary" shape="round" className="button--xl">
                Upload Your Art
              </Button>
            </NavLink>
          </p>
        </div>
      </div>
      <CuratedInks
        localProvider={localProvider}
        injectedProvider={injectedProvider}
      />
    </div>
  );
}

export default Homepage;
