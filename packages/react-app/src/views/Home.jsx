import "../styles/homepage.css";

function Home({ readContracts, mainnetProvider, blockExplorer, totalSupply, DEBUG }) {
  return (
    <div className="homepage">
      <div className="homepage__container">
        <img src="/assets/loggiesPicker.svg" className="homepage__pickerImg" alt="Loggies Picker" />
        <p className="homepage__heading">Loogies with a smile :)</p>
        <div className="homepage-txtBtnContainer">
          <p className="homepage__text">
            Only <span className="homepage__span">3728 Optimistic Loogies</span> available on a price curve{" "}
            <span className="homepage__span">increasing 0.2%</span> with each new mint. Double the supply of the{" "}
            <a href="https://loogies.io" target="_blank" rel="noreferrer">
              Original Ethereum Mainnet Loogies
            </a>
          </p>
          <div className="homepage__btn">
            <p className="homepage__btnText">Mint Now for</p>
            <img src="/assets/fa-ethereum.svg" alt="ethereum" className="homepage__btnImg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
