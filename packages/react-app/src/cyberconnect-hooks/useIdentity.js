import { useEffect, useState } from "react";
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

export default function useIdentity({ address }) {
  const [identity, setIdentity] = useState(undefined);

  useEffect(() => {
    if (!address) return;

    client
      .request(GET_IDENTITY, {
        address: address,
      })
      .then(res => {
        console.log("🧬🧬-CyberConnect-identity-start-🧬🧬");
        console.log(res.identity);
        console.log("🧬🧬-CyberConnect-identity---end-🧬🧬");
        setIdentity(res.identity);
      })
      .catch(err => {
        console.error(err);
      });
  }, [address]);

  return identity;
}
