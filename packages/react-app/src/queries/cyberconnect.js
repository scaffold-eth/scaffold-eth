import { GraphQLClient, gql } from "graphql-request";

// CyberConnect Protocol endpoint
const CYBERCONNECT_ENDPOINT = "https://api.cybertino.io/connect/";

// Initialize the GraphQL Client
const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// You can add/remove fields in query
export const GET_CONNECTIONS = gql`
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

export async function getFollowList({ address }) {
  if (!address) return;

  const res = await client.request(GET_CONNECTIONS, {
    address: address,
    first: 5,
  });

  console.log("getFollowList: ----------", res);

  if (res && res.identity) {
    console.log("🧬🧬-CyberConnect-connections-start-🧬🧬");
    console.log(res.identity);
    console.log("🧬🧬-CyberConnect-connections---end-🧬🧬");
  }

  return res?.identity;
}

export async function getFollowStatus({ fromAddr, toAddr }) {
  if (!fromAddr) return;
  if (!toAddr) return;

  const res = await client.request(GET_FOLLOWSTATUS, {
    address: address,
    first: 5,
  });
}
