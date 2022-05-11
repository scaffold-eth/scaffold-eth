import { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

// CyberConnect Protocol endpoint
const CYBERCONNECT_ENDPOINT = "https://api.cybertino.io/connect/";

// Initialize the GraphQL Client
const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// You can add/remove fields in query
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

export default function useFollowStatus({ fromAddr, toAddr }) {
  const [followStatus, setFollowStatus] = useState(false);

  useEffect(() => {
    if (!fromAddr) return;
    if (!toAddr) return;

    client
      .request(GET_FOLLOWSTATUS, {
        fromAddr: fromAddr,
        toAddrList: [toAddr],
      })
      .then(res => {
        console.log("🧬🧬-CyberConnect-status-start-🧬🧬");
        console.log(res.connections[0]?.followStatus?.isFollowing);
        console.log("🧬🧬-CyberConnect-status---end-🧬🧬");
        setFollowStatus(res.connections[0]?.followStatus?.isFollowing);
      })
      .catch(err => {
        console.error(err);
      });
  }, [fromAddr, toAddr]);

  return followStatus;
}
