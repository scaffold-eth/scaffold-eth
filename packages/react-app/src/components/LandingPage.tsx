import { FunctionComponent, useCallback } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: FunctionComponent = () => {
  const navigate = useNavigate();

  const onConnectButtonContainerClick = useCallback(() => {
    navigate("/book-housing");
  }, [navigate]);

  return (
    <div className="landing-page">
      <Footer
        propTop="2334px"
        propBackgroundColor="#ae3208"
        propCursor="unset"
        propCursor1="unset"
      />
      <div className="landing-page1">
        <div className="description">
          <div className="rectangle" />
          <div className="welcome-to-metastays-container">
            <span className="welcome-to-metastays-container1">
              <p className="welcome-to-metastays-where-r">
                <i className="welcome-to-metastays">
                  Welcome to MetaStays - Where Real Estate Meets the Metaverse
                </i>
              </p>
              <p className="blank-line">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>{`Unlock a new era of property rentals with `}</span>
                  <span className="metastays">MetaStays</span>
                  <span>, the world's first web3 property marketplace.</span>
                </span>
              </p>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <i className="key-features1">Key Features:</i>
                </span>
              </p>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <ul className="pay-with-crypto-experience-ha">
                <li className="pay-with-crypto-experience-ha1">
                  <span>
                    <span>
                      Pay with Crypto: Experience hassle-free transactions using
                      your favorite cryptocurrencies. Say goodbye to traditional
                      payment methods, with Unlock.
                    </span>
                  </span>
                </li>
              </ul>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <ul className="pay-with-crypto-experience-ha">
                <li className="pay-with-crypto-experience-ha1">
                  <span>
                    <span>
                      Verified Listings: Trust in the accuracy and authenticity
                      of property listings, our tenants and landlords with
                      WorldID.
                    </span>
                  </span>
                </li>
              </ul>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <ul className="pay-with-crypto-experience-ha">
                <li className="pay-with-crypto-experience-ha1">
                  <span>
                    <span>
                      Community-Driven Reviews: Connect with like-minded
                      travelers and hosts on Lens, our integrated web3 social
                      platform. Share your experiences and make informed
                      decisions!
                    </span>
                  </span>
                </li>
              </ul>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <ul className="pay-with-crypto-experience-ha">
                <li className="pay-with-crypto-experience-ha1">
                  <span>
                    <span>
                      Efficient Search with The Graph: Find your perfect rental
                      property quickly and easily, thanks to our indexed data
                      powered by The Graph Protocol.
                    </span>
                  </span>
                </li>
              </ul>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <p className="welcome-to-metastays-where-r">
                <span>
                  <span>
                    Join us in revolutionizing the way you stay. Dive into
                    MetaStays and embark on a journey where the future of
                    accommodation is at your fingertips.
                  </span>
                </span>
              </p>
            </span>
          </div>
        </div>
        <i className="and-the-comfort">
          ... and the comfort of your next home away from home
        </i>
        <i className="discover-the-fusion-container">
          <span className="welcome-to-metastays-container1">
            <p className="welcome-to-metastays-where-r">
              Discover the fusion of cutting
            </p>
            <p className="welcome-to-metastays-where-r">
              edge blockchain technology...
            </p>
          </span>
        </i>
        <div className="connect-button" onClick={onConnectButtonContainerClick}>
          <div className="connect-button-child" />
          <div className="connect">CONNECT</div>
        </div>
        <img className="metastays-1-icon" alt="" src="/metastays-1@2x.png" />
      </div>
    </div>
  );
};

export default LandingPage;
