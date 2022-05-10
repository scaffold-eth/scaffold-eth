import { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

// CyberConnect Protocol endpoint
const CYBERCONNECT_ENDPOINT = "https://api.cybertino.io/connect/";

// Initialize the GraphQL Client
const client = new GraphQLClient(CYBERCONNECT_ENDPOINT);

// You can add/remove fields in query
export const GET_FollowStatus = gql`
    query searchUserInfo(
        $fromAddr: String!
        $toAddr: String!
        $namespace: String
        $network: Network
    ) {
        connections.followStatus(
            fromAddr: $fromAddr
            toAddr: $toAddr
            namespace: $namespace
            network: $network
        ) {
            isFollowed
            isFollowing
        }
    }
    `;

export default function GetFollowStatus({ fromAddr, toAddr }) {
  const [followStatus, setFollowStatus] = useState(undefined);

  useEffect(() => {
    if (!fromAddr || !toAddr) return;

    client
      .request(GET_FollowStatus, {
        fromAddr: fromAddr,
        toAddr: toAddr,
      })
      .then(res => {
        console.log("🧬🧬-CyberConnect-GET_FollowStatus-start-🧬🧬");
        console.log(res.connections[0]);
        console.log("🧬🧬-CyberConnect-GET_FollowStatus---end-🧬🧬");
        setFollowStatus(res.connections[0]);
      })
      .catch(err => {
        console.error(err);
      });
  }, [fromAddr, toAddr]);

  return followStatus;
}
