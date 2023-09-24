import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import FormHeader from "../components/FormHeader";
import Container from "../components/Container";
import "./NoPropertiesToManage.css";

const NoPropertiesToManage: FunctionComponent = () => {
  const navigate = useNavigate();

  const onLogoContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onSubheaderContainerClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onRadioClick = useCallback(() => {
    navigate("/no-properties-to-manage");
  }, [navigate]);

  const onRadio1Click = useCallback(() => {
    navigate("/book-housing");
  }, [navigate]);

  return (
    <div className="no-properties-to-manage">
      <Footer
        propTop="878px"
        propBackgroundColor="#010b49"
        propCursor="pointer"
        propCursor1="unset"
        onLogoContainerClick={onLogoContainerClick}
      />
      <FormHeader
        dimensions="/notification.svg"
        propCursor="pointer"
        propColor="#ab4216"
        propCursor1="unset"
        propWidth="152px"
        propHeight="70px"
        propWidth1="37px"
        propCursor2="pointer"
        onSubheaderContainerClick={onSubheaderContainerClick}
        onRadioClick={onRadioClick}
        onRadio1Click={onRadio1Click}
      />
      <Container />
      <img className="head-house-icon1" alt="" src="/headhouse2.svg" />
    </div>
  );
};

export default NoPropertiesToManage;
