import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import CardWithRating from "../components/CardWithRating";
import CardContainer from "../components/CardContainer";
import FormHeader from "../components/FormHeader";
import SearchFormContainer from "../components/SearchFormContainer";
import "./BookHousing.css";

const BookHousing: FunctionComponent = () => {
  const navigate = useNavigate();

  const onMETASTAYSTextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onCard3ContainerClick = useCallback(() => {
    navigate("/mint-the-key");
  }, [navigate]);

  const onRadioClick = useCallback(() => {
    navigate("/no-properties-to-manage");
  }, [navigate]);

  return (
    <div className="book-housing">
      <div className="background" />
      <Footer
        propTop="1080px"
        propBackgroundColor="#ab4216"
        propCursor="unset"
        propCursor1="unset"
      />
      <Footer
        propTop="1080px"
        propBackgroundColor="#010b49"
        propCursor="unset"
        propCursor1="pointer"
        onMETASTAYSText1Click={onMETASTAYSTextClick}
      />
      <CardWithRating
        imageId="/image-182@2x.png"
        carVersionCarRating="5.0"
        locationName="Pier 60"
        staySize="400 stays"
        distance="3.5 mi"
        onCard3ContainerClick={onCard3ContainerClick}
      />
      <CardWithRating
        imageId="/image-171@2x.png"
        carVersionCarRating="1.0"
        locationName="Murder House"
        staySize="5 stays"
        distance="2.4 mi"
        propLeft="682px"
        propCursor="unset"
        propWidth="200px"
        propHeight="45px"
      />
      <CardContainer />
      <FormHeader
        dimensions="/notification.svg"
        propCursor="unset"
        propColor="#ae3208"
        propCursor1="pointer"
        propWidth="152px"
        propHeight="70px"
        propWidth1="37px"
        propCursor2="unset"
        onMETASTAYSText1Click={onMETASTAYSTextClick}
        onRadioClick={onRadioClick}
      />
      <SearchFormContainer />
      <img className="head-house-icon" alt="" src="/headhouse3.svg" />
    </div>
  );
};

export default BookHousing;
