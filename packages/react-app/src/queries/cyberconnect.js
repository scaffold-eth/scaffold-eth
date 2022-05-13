import { GraphQLClient, gql } from "graphql-request";

// CyberConnect Protocol endpoint
const CYBERCONNECT_ENDPOINT = "https://api.cybertino.io/connect/";

// Initialize the GraphQL Client
const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// You can add/remove fields in query
export const GET_IDENTITY = gql`
  query ($address: String!) {
    identity(address: $address) {
      address
      domain
      avatar
      followerCount
      followingCount
      twitter {
        handle
      }
    }
  }
`;

export const GET_FOLLOWLIST = gql`
  query ($address: String!, $first: Int) {
    identity(address: $address) {
      followings(first: $first) {
        list {
          address
          domain
        }
      }
      followers(first: $first) {
        list {
          address
          domain
        }
      }
    }
  }
`;

export const GET_FOLLOWSTATUS = gql`
  query ($fromAddr: String!, $toAddrList: [String!]!) {
    connections(fromAddr: $fromAddr, toAddrList: $toAddrList) {
      followStatus {
        isFollowing
        isFollowed
      }
    }
  }
`;
// Get Address Profile Identity
export async function getIdentity({ address }) {
  if (!address) return;

  const res = await client.request(GET_IDENTITY, {
    address: address,
  });

  console.log("getIdentity: ----------", res);

  if (res && res.identity) {
    console.log("🧬🧬-CyberConnect-identity-start-🧬🧬");
    console.log(res.identity);
    console.log("🧬🧬-CyberConnect-identity---end-🧬🧬");
  }

  return res?.identity;
}

// Get Address Profile Connections
export async function getConnections({ address }) {
  if (!address) return;

  const res = await client.request(GET_FOLLOWLIST, {
    address: address,
    first: 5,
  });

  console.log("GetConnections: ----------", res);

  if (res && res.identity) {
    console.log("🧬🧬-CyberConnect-connections-start-🧬🧬");
    console.log(res.identity);
    console.log("🧬🧬-CyberConnect-connections---end-🧬🧬");
  }

  return res?.identity;
}

// Get Address Follow Status
export async function getFollowStatus({ fromAddr, toAddr }) {
  if (!fromAddr) return;
  if (!toAddr) return;

  const res = await client.request(GET_FOLLOWSTATUS, {
    fromAddr: fromAddr,
    toAddrList: [toAddr],
  });

  console.log("getFollowStatus:-----------", res);

  if (res && res.connections[0]) {
    console.log("🧬🧬-CyberConnect-status-start-🧬🧬");
    console.log(res.connections[0]?.followStatus?.isFollowing);
    console.log("🧬🧬-CyberConnect-status---end-🧬🧬");
  }

  return res?.connections[0]?.followStatus?.isFollowing;
}
