import React from 'react'
import { useLocalStorage } from 'react-use'
import Markdown from 'markdown-to-jsx'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'
import { LEVEL_ID } from '..'

// https://docs.scaffoldeth.io/scaffold-eth/examples-branches/defi/bonding-curve

const ExplanationWindow = ({
  isOpen,
  continueDialog,
  setWhatIsABondingCurveWindowVisibility,
  setPriceSensitivityWindowVisibility
}) => {
  const [currentStep, setCurrentStep] = useLocalStorage(`${LEVEL_ID}-currentStep`, 0)

  return (
    <WindowModal
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Bonding Curves'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          backgroundColor: '#161B22'
        }}
      >
        <h1>What is a Bonding Curve?</h1>
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          A Bonding curve is a mathematical curve that defines a relationship between price and
          token supply.
          {currentStep > 0 && (
            <>
              <br />
              Basically as a the supply of a token increases the it's price increases as well hence
              the price of nth token will be less than n+1 th token and so on.
            </>
          )}
          {currentStep > 1 && (
            <>
              <br />
              <br />
              <h2>How does it work</h2>
              So basically it works like this during the deployment there is a Mock DAI contract
              that is deployed as well in addition to YourContract.sol and while the owner locks
              some mock DAI into the contract to set the reserve amount which also demonstrates the
              use of approve and call i.e approving YourContract for spending mock dai and minting
              in the same block, then anyone can call the mint function lock up some eth and they
              get some SMILE (😃) Tokens minted based on a formula discussed below, and in order to
              get your mock DAI amount back you need to call burn() and burn the SMILE (😃) tokens
              and based on the price at that point you get some amount of eth back.
            </>
          )}
          {currentStep > 2 && (
            <>
              <br />
              <br />
              <h2>Price Sensitivity</h2>
              As mentioned below Purchase Return is basically the number of 😃 Tokens you get when
              you lock in your Mock DAI Tokens, now this and Sale Return depend on mainly 3
              variables ReserveTokensReceived The Amount of Mock DAI you decide to lock in.
              <br />
              <br />
              <ul>
                <li>
                  <b>ReserveTokenBalance</b> The Amount of Mock DAI you decide to lock in.
                </li>
                <li>
                  <b>ReserveTokenBalance</b> The Mock DAI Tokens already locked before (for testing
                  purposes when no 😃 Tokens have been minted yet we assume the ReserveTokenBalance
                  to be 1 wei, in a mainnet scenario as soon as the contract is deployed we transfer
                  a small amount i.e 1 wei worth of reserve token to the contract).
                </li>
                <li>
                  <b>ReserveRatio</b> Currently it is set at 10 % but let's see how different
                  reserve ratio's affect the price.
                </li>
              </ul>
            </>
          )}
          {currentStep > 3 && (
            <>
              <br />
              The diagram to the right shows some examples of bonding curves with different Reserve
              Ratios. In the bottom-left curve with a 10% Reserve Ratio, the price curve grow more
              aggressively with increasing supply. A Reserve Ratio higher than 10% would flatten
              towards the linear top-right shape as it approaches 50%.
            </>
          )}
          {currentStep > 4 && (
            <>
              <br />
              <br />
              <h2>Mathmatical Formula</h2>
              <ul>
                <li>
                  <b>Reserve Ratio</b> When deploying we need to pass in a reserve ratio which
                  currently is 100000(10 %) for high price sensitivity but can range from 0 - 100,
                  higher reserve ratio between the Reserve Token balance and the SMILE (😃) Token
                  will result in lower price sensitivity, meaning that each buy and sell will have a
                  less than proportionate effect on the SMILE (😃) Token’s price movement. Though it
                  is calculated as Reserve Ratio = Reserve Token Balance / (SMILE Token Supply x
                  SMILE Token Price)
                </li>
                <li>
                  <b>Sale Return</b> The Amount of Mock DAI you get based on the amount of SMILE
                  (😃) token's you choose to burn and the current price at that point it is
                  calculated as Sale Return = ReserveTokenBalance * (1 - (1 - SMILE Token Received /
                  SMILE Token Supply) ^ (1 / (ReserveRatio)))
                </li>
              </ul>
            </>
          )}
        </div>

        {currentStep <= 4 && (
          <Button
            onClick={() => {
              if (currentStep === 3) {
                setWhatIsABondingCurveWindowVisibility(true)
              }
              if (currentStep === 4) {
                setPriceSensitivityWindowVisibility(true)
              }
              setCurrentStep(currentStep + 1)
            }}
          >
            Continue
          </Button>
        )}
        {currentStep > 4 && (
          <Button
            className='is-warning'
            onClick={() => {
              continueDialog()
              setCurrentStep(currentStep + 1)
            }}
          >
            Done
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
