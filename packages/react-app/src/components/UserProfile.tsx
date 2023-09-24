import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OwnedPropertiesContainer from "../components/OwnedPropertiesContainer";
import Footer from "../components/Footer";
import FormHeader from "../components/FormHeader";
import RecentStaysContainer from "../components/RecentStaysContainer";
import "./UserProfile.css";

const UserProfile: FunctionComponent = () => {
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

  return (
    <div className="user-profile">
      <OwnedPropertiesContainer />
      <Footer onLogoContainerClick={onLogoContainerClick} />
      <FormHeader
        dimensions="/notification.svg"
        onMETASTAYSText1Click={onMETASTAYSTextClick}
        onRadioClick={onRadioClick}
      />
      <div className="user-profile-child" />
      <img className="user-profile-item" alt="" src="/ellipse-1.svg" />
      <img className="user-profile-inner" alt="" src="/ellipse-2.svg" />
      <img className="image-19-icon" alt="" src="/image-19@2x.png" />
      <div className="skellyman0218">{`@Skellyman0218 `}</div>
      <div className="edit-profile-button">
        <div className="edit-profile-button-child" />
        <div className="go-to-lens">GO TO LENS</div>
      </div>
      <i className="skellymanlens">{`@skellyman.lens `}</i>
      <div className="recent-stays">
        <div className="recent-stays-child" />
        <div className="frame-parent">
          <div className="rectangle-parent">
            <div className="edit-profile-button-child" />
            <div className="recent-stays1">Recent Stays</div>
          </div>
          <RecentStaysContainer />
        </div>
      </div>
      <div className="skelly-smith">
        <p className="p">Skelly Smith</p>
        <p className="p">&nbsp;</p>
        <p className="p">&nbsp;</p>
        <p className="p">&nbsp;</p>
        <p className="p">{`   `}</p>
      </div>
      <img className="icon-t-green-2x-1" alt="" src="/icontgreen-2x-1@2x.png" />
    </div>
  );
};

export default UserProfile;
