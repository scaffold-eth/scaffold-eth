import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import FormHeader from "../components/FormHeader";
import "./MintTheKey.css";

const MintTheKey: FunctionComponent = () => {
  const navigate = useNavigate();

  const onLogoContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onMETASTAYSTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onRadioClick = useCallback(() => {
    navigate("/no-properties-to-manage");
  }, [navigate]);

  const onButtonContainerClick = useCallback(() => {
    navigate("/user-profile");
  }, [navigate]);

  return (
    <div className="mint-the-key">
      <Footer
        propTop="984px"
        propBackgroundColor="#010b49"
        propCursor="pointer"
        propCursor1="unset"
        onLogoContainerClick={onLogoContainerClick}
      />
      <div className="information-parent">
        <div className="information">
          <img className="image-18-icon" alt="" src="/image-181@2x.png" />
          <img className="information-child" alt="" src="/rectangle-2.svg" />
        </div>
        <div className="button" onClick={onButtonContainerClick}>
          <div className="button-child" />
          <div className="mint-key">MINT KEY</div>
        </div>
        <i className="wanna-metastay">
          <span className="wanna-metastay-txt-container">
            <p className="venue-capacity">Wanna MetaStay?</p>
          </span>
        </i>
        <div className="frame-child" />
        <b className="b">5.0</b>
        <img className="vector-icon" alt="" src="/vector.svg" />
      </div>
      <div className="welcome-to-pier-container">
        <span>{`Welcome to `}</span>
        <b>Pier Sixty</b>
        <span>{`, New York's premier event venue located in the heart of Chelsea Piers. This stunning waterfront location offers unparalleled views of the Hudson River and the iconic Manhattan skyline, making it the perfect backdrop for your next event. `}</span>
      </div>
      <div className="venue-capacity-cocktail-container">
        <p className="venue-capacity">Venue Capacity:</p>
        <ul className="cocktail-reception-up-to-200">
          <li className="seated-dinner-up-to-1200-gue">
            <span>Cocktail Reception: Up to 2,000 guests</span>
          </li>
          <li className="seated-dinner-up-to-1200-gue">
            <span>Seated Dinner: Up to 1,200 guests</span>
          </li>
          <li className="seated-dinner-up-to-1200-gue">
            <span>Conference Style: Up to 800 guests</span>
          </li>
          <li className="seated-dinner-up-to-1200-gue">
            <span>Theater Style: Up to 500 guests</span>
          </li>
        </ul>
        <p className="venue-capacity">&nbsp;</p>
        <p className="venue-capacity">
          <i>{`great food, amazing view, incredible service `}</i>
          <span className="from">{`from `}</span>
          <b className="from">Lens</b>
        </p>
      </div>
      <FormHeader
        dimensions="/notification1.svg"
        propCursor="unset"
        propColor="#ab4216"
        propCursor1="pointer"
        propWidth="210px"
        propHeight="97px"
        propWidth1="25px"
        propCursor2="unset"
        onMETASTAYSText1Click={onMETASTAYSTextClick}
        onRadioClick={onRadioClick}
      />
      <img className="head-house-icon2" alt="" src="/headhouse1.svg" />
    </div>
  );
};

export default MintTheKey;
