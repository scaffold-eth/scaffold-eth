import { useEffect, useState } from "react";
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

export default function useConnections({ address }) {
  const [connections, setConnections] = useState(undefined);

  useEffect(() => {
    if (!address) return;

    client
      .request(GET_CONNECTIONS, {
        address: address,
        first: 5,
      })
      .then(res => {
        console.log("🧬🧬-CyberConnect-connections-start-🧬🧬");
        console.log(res.identity);
        console.log("🧬🧬-CyberConnect-connections---end-🧬🧬");
        setConnections(res.identity);
      })
      .catch(err => {
        console.error(err);
      });
  }, [address]);

  return connections;
}
