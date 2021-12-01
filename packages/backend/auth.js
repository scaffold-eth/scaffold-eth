const jwt = require("jsonwebtoken");
const ethers = require("ethers");

const getProvider = () => {
  return new ethers.providers.StaticJsonRpcProvider(process.env.PROVIDER);
};

const userHasToken = async (address) => {
  const GODSTokenAddress = process.env.TOKEN;
  const EARTHTokenAddress = process.env.TOKEN2;
  const expectedBalance = ethers.utils.parseEther("1");
  const abi = [
    "function balanceOf(address _owner) external view returns (uint256)",
  ];

  const GODSToken = new ethers.Contract(GODSTokenAddress, abi, getProvider());
  const EARTHToken = new ethers.Contract(EARTHTokenAddress, abi, getProvider());

  const GODSBalance = await GODSToken.balanceOf(address);
  const EARTHBalance = await EARTHToken.balanceOf(address);

  // require balance to be >= 2
  return GODSBalance.gte(expectedBalance) || EARTHBalance.gte(expectedBalance);
};

const signUserData = (data) => {
  return jwt.sign(data, process.env.SECRET, {
    expiresIn: "30m",
  });
};

const verifyUser = async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    // todo : validate user token access here using the decoded

    console.log({ decoded });
    const hasToken = await userHasToken(decoded.address);

    if (!hasToken) {
      throw new Error(`You don't have require Access NFT for this website.`);
    }

    req.user = decoded;
  } catch (err) {
    console.log(err);

    return res
      .status(401)
      .send(err.message || "Invalid Token. Please sign in.");
  }
  return next();
};

module.exports = {
  userHasToken,
  signUserData,
  verifyUser,
};
