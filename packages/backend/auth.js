const jwt = require("jsonwebtoken");
const ethers = require("ethers");

const getProvider = () => {
  return new ethers.providers.StaticJsonRpcProvider(process.env.PROVIDER);
};

const userHasToken = async (address) => {
  const tokenAddress = process.env.TOKEN;
  const abi = [
    "function balanceOf(address _owner) external view returns (uint256)",
  ];

  const tokenContract = new ethers.Contract(tokenAddress, abi, getProvider());

  const balance = await tokenContract.balanceOf(address);

  return balance.gt(0);
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
