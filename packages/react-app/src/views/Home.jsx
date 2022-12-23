import "../styles/homepage.css";
import Loogies from "./Loogies";
import { ethers } from "ethers";
import axios from "axios";

function Home({
  readContracts,
  mainnetProvider,
  blockExplorer,
  totalSupply,
  DEBUG,
  tx,
  writeContracts,
  priceToMint,
  loogiesLeft,
  serverUrl,
  setBalance,
  address,
}) {
  const mintLoogie = async () => {
    const priceRightNow = await readContracts.YourCollectible.price();
    try {
      const txCur = await tx(writeContracts.YourCollectible.mintItem({ value: priceRightNow, gasLimit: 300000 }));
      await txCur.wait();
      axios
        .get(`${serverUrl}/loogies/${address}/balance`)
        .then(function (response) {
          if (DEBUG) console.log("balanceFromServer: ", response);
          setBalance(response.data);
        })
        .catch(async function (error) {
          console.log("Error getting balance from indexer: ", error.message);
          if (readContracts.YourCollectible) {
            const balanceFromContract = await readContracts.YourCollectible.balanceOf(address);
            if (DEBUG) console.log("balanceFromContract: ", balanceFromContract.toNumber());
            setBalance(balanceFromContract.toNumber());
          }
        });
    } catch (e) {
      console.log("mint failed", e);
    }
  };

  return (
    <>
      <div style={{ overflow: "hidden" }}>
        <div
          className="homepage"
          style={{
            backgroundImage: "url('LOOGIES.svg')",
          }}
        >
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
              <div className="homepageBtn__container">
                <button className="homepage__btn" onClick={mintLoogie}>
                  <p className="homepage__btnText">
                    Mint Now for {priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
                  </p>
                  <img src="/assets/fa-ethereum.svg" alt="ethereum" className="homepage__btnImg" />
                </button>
                <p className="homepage__text">
                  <span className="homepage__span">{loogiesLeft} left</span>
                </p>
              </div>
            </div>
            <p className="homepage__text  homepage__text--publicGoodText">
              All Ether from sales goes to public goods!!
            </p>
          </div>
        </div>
      </div>
      <Loogies
        readContracts={readContracts}
        mainnetProvider={mainnetProvider}
        blockExplorer={blockExplorer}
        totalSupply={totalSupply}
        DEBUG={DEBUG}
        serverUrl={serverUrl}
      />
    </>
  );
}

export default Home;
