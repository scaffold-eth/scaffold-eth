import { BACKEND_URL } from "../constants";
import { stringify } from "./preserveJson";

export const getLoggedInStatus = async () => {
  const res = await fetch(`${BACKEND_URL}/auth`, {
    method: "get",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  console.log(res);
  return res.ok;
};

export const logoutHandler = async () => {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

export const verifyChallengeHandler = async (msg, sign) => {
  const bodyStr = stringify({
    originalBytes: new Uint8Array(Buffer.from(msg, "utf8")),
    signatureBytes: new Uint8Array(Buffer.from(sign, "utf8")),
  }); //hack to preserve uint8 arrays

  const verificationRes = await fetch(`${BACKEND_URL}/verifyChallenge`, {
    method: "post",
    body: bodyStr,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then(res => res.json());

  return verificationRes;
};

export const getChallengeParams = async address => {
  const challengeParams = await fetch(`${BACKEND_URL}/challengeParams`, {
    method: "post",
    body: JSON.stringify({ address: address }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then(res => res.json());

  return challengeParams;
};
