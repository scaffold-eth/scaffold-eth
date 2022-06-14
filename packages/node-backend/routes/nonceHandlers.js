/**
 * TODO: These functions must be custom implemented by you to prevent replay attacks. If you leave them how they are by
 * default, all signing-in functionality will still work, but it is not safe to use in production.
 *
 * Replay attacks are where an adversary intercepts a valid (challenge, signature) pair from a user. The adversary can then
 * use this (challenge, signature) pair to sign in as the user because the pair is valid. To protect against this, we only accept
 * sign-in requests that use a specific nonce on the first request only. If a nonce has already been used, we deny the sign-in attempt.
 */

/**
 * Implement your own nonce generation scheme here. The EIP-4361 Sign-In with Ethereum interface recommends a nonce with at least 8 
 * alphanumeric characters.
 *
 * Blockin natively offers a nonce generation function that gets a recent block hash or ID (await generateNonceUsingLastBlockTimestamp()).
 * To use this native Blockin nonce scheme, you MUST have a valid ChainDriver with API key set (see chainDriverHandlers.js).
 */
export const generateNonce = async (address) => {
  return "To prevent against replay attacks, you must implement a nonce generation and verification scheme.";
};

/**
 * Verify that this is the first time the nonce is being used by this address.
 *
 * If it is a replay attack, we throw an error and don't verify this sign-in attempt.
 */
export const verifyNonce = async (nonce, address) => {
  const nonceIsValid = true;

  if (nonceIsValid) return;
  else throw `Nonce is invalid`;
};
