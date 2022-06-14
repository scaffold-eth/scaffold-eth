import {
  constructChallengeObjectFromString,
  setChainDriver,
  verifyChallenge,
} from "blockin";
import { getChainDriver } from "./chainDriverHandlers.js";
import { generateNonce, verifyNonce } from "./nonceHandlers.js";
import { parse } from "../utils/preserveJson.js";
import express from "express";

var router = express.Router();

/**
 * The challenge parameters returned here will be used to customize the sign-in challenge message that users will need to sign.
 *
 * These are passed in via the challengeParams prop for the BlockinUIDisplay React component on your frontend.
 */
router.post("/challengeParams", async function (req, res, next) {
  const chainDriver = getChainDriver("Ethereum");
  setChainDriver(chainDriver);

  const currentDate = new Date();
  const expirationDate = new Date(
    currentDate.setHours(currentDate.getHours() + 24)
  );

  /**
   * //TODO: Customize these to customize the sign-in message users have to sign.
   */
  const challengeParams = {
    //Domain and URI should have the same hostname
    domain: "http://localhost:3000",
    uri: "http://localhost:3000/login",
    //Add any message that you would like to tell the user
    statement:
      "Sign in to this website with Blockin. You will remain signed in until you terminate your browser session.",
    address: req.body.address,
    /**
     * TODO: You MUST custom implement both generateNonce() and verifyNonce() in ./nonceHandlers.js. Without these implemented,
     * this is not safe to be used in a production environment (although all functionality will still work).
     */
    nonce: await generateNonce(req.body.address),
    //issuedAt, notBefore, and expirationDate must be in ISO string format. JavaScript's Date.toISOString() method works
    issuedAt: currentDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    notBefore: undefined,
    //These will both default to 1
    chainId: undefined,
    version: undefined,
    /**
     * This is ignored in our implementation since the displayedResources prop in the frontend UI component overrides this.
     *
     * However in the displayedResources prop, you can define URIs and NFTs that can be inlcuded in the user's sign-in request.
     *
     * If any NFTs are specified, you must have a valid ChainDriver with API key set in chainDriverHandlers.js. Blockin
     * will then scan the blockchain to ensure that the requested address owns those NFTs.
     */
    resources: undefined,
  };

  return res.status(200).json(challengeParams);
});

/**
 * This endpoint verifies a challenge is well formed and correct.
 *
 * If this function returns with a success, the sign-in attempt should be fully verified and user
 * should be granted privileges.
 */
router.post("/verifyChallenge", async function (req, res, next) {
  const chainDriver = getChainDriver("Ethereum");
  setChainDriver(chainDriver);

  const body = parse(JSON.stringify(req.body)); //hack to preserve Uint8Arrays over HTTP

  console.log(body.originalBytes);
  //TODO: If any NFTs are specified in the request (default is none), make sure the ChainDriver in chainDriverHandlers.js
  //has a valid API key
  try {
    const verificationResponse = await verifyChallenge(
      body.originalBytes,
      body.signatureBytes,
      {
        /**
         * You can add additional checks to ensure that the domain and URI are what they are supposed to be
         */
        expectedDomain: undefined,
        expectedUri: undefined,
        /**
         * The default is to check that a user owns >= 1 of any requested NFT. This defaultMinimum can be set here to be
         * higher or lower.
         *
         * Also, you can define a JSON object of { 'assetId' : minimumBalanceRequired, 'assetId2' : minimumBalanceRequired, ... }
         * to custom set the minimum balances for specific assets.
         */
        defaultMinimum: undefined,
        assetMinimumBalancesRequiredMap: undefined,
      }
    );

    console.log("Blockin has verified the challenge");

    /**
     * Now, Blockin has successfully verified the following five things:
     * 1) Challenge is well-formed
     * 2) Challenge is valid at present time (between notBefore and expirationDate)
     * 3) Challenge was signed correctly by the address specified in the challenge
     * 4) User owns at least the minimum balance required of the requested assets (if any) at time of signing in
     * 5) Any additional verification checks specified in the verifyChallenge options
     *
     * Next, you must add any other validity checks not checked or logic not performed by Blockin.
     *  -Nonce verification MUST be implemented here to prevent replay attacks
     *  -Assert all other information is correct, such as details in your private database about the requesting user
     *
     * You may find the tools below helpful. See https://blockin.gitbook.io/blockin/reference/library-documentation
     * for documentation. Note that any function that has a ** next to it requires a ChainDriver with an API key set. if you
     * plan to use one of these functions, make sure the ChainDriver in chainDriverHandlers.js is initialized with an API key.
     *      -You can use chainDriver.functionName where functionName is in the ChainDriver interface.
     *      -You can also use the helper functions exported from Blockin to manipulate and parse challenges
     *
     * Once everything is validated and verified, you can add the logic below to grant the user access to your
     * resource. This can be via any method of your choice, such as JWTs, Session Tokens, HTTPOnly Cookies, etc.
     *
     * This template by default implements using an HTTP only session cookie.
     */
    const challengeString =
      await chainDriver.parseChallengeStringFromBytesToSign(body.originalBytes);
    const challengeObject = constructChallengeObjectFromString(challengeString);

    await verifyNonce(challengeObject.nonce, challengeObject.address); //TODO: You must implement this and prevent replay attacks

    console.log("Nonce is verified");

    const cookieData = {
      challengeString: challengeString,
      signedIn: true,
    };

    //See res.cookie documentation for more options: https://expressjs.com/en/api.html
    res.cookie("siwe", JSON.stringify(cookieData), {
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ verified: true, message: verificationResponse.message });
  } catch (err) {
    return res.status(400).json({ verified: false, message: `${err}` });
  }
});

export default router;
