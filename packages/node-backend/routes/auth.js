import express from "express";

/**
 * This file is for all your authenticated routes. These can only be accessed once a user is authenticated.
 *
 * In the default case, one is authenticated by calling /verifyChallenge. This sets an HTTPOnly cookie called 'siwe'.
 */

var router = express.Router();

/**
 * Authentication middleware - Check if the 'siwe' cookie has been set.
 */
export const authenticate = (req, res, next) => {
  if (req.cookies && req.cookies.siwe) {
    return next();
  } else {
    return res.status(403).json({
      error:
        "Unauthenticated. You must be verified through the /verifyChallenge endpoint",
    });
  }
};

/**
 * Simple check to see if a user is authenticated. Will fail on the authenticate() middleware if not.
 */
router.get("/", function (req, res, next) {
  return res
    .status(200)
    .json({ success: true, message: "You are authenticated!" });
});

/**
 * Logs a user out by clearing the cookie.
 */
router.post("/logout", function (req, res, next) {
  res.clearCookie("siwe");
  return res
    .status(200)
    .json({ success: true, message: "Successfully logged out!" });
});

export default router;
