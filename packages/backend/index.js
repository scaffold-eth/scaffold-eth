require("dotenv").config();

const ethers = require("ethers");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const auth = require("./auth");
const jwt = require("express-jwt");

const PORT = process.env.PORT || 49832;

app.use(cors());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  console.log("/");
  res.status(200).send("Hello video DApp");
});

app.post("/signIn", async function (req, res) {
  const { message, signature, address = "" } = req.body;

  try {
    const recovered = ethers.utils.verifyMessage(message, signature);
    if (recovered.toLowerCase() === address.toLowerCase()) {
      // use address to check if user has token and then send signed jwt access token

      const hasToken = await auth.userHasToken(address);

      if (!hasToken) {
        throw new Error(null);
      }

      const authToken = auth.signUserData({
        address,
        video: process.env.VIDEO,
      });

      // todo : use for same site requests
      // res.cookie("token", authToken, { httpOnly: true });

      res.status(200).json({ authToken });
    } else {
      throw new Error("Mismatched address and signature");
    }
  } catch (error) {
    res.status(400).send(error.message || "You are not allowed into this club");
  }
});

// authenticated routes start here
// app.use(
//   jwt({
//     secret: process.env.SECRET,
//     algorithms: ["HS256"],
//     getToken: (req) => {
//       return req.cookies.token;
//     },
//   })
// );

app.get("/video", auth.verifyUser, function (req, res) {
  // todo : validate user NFT access here

  const path = "assets/sample.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

var server = app.listen(PORT, function () {
  console.log("HTTP Listening on port:", server.address().port);
});
