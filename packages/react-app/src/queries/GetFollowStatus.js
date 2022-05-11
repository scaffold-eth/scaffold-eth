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

export default function GetFollowStatus({ fromAddr, toAddrList }) {
  const [followStatus, setFollowStatus] = useState(undefined);

  useEffect(() => {
    console.log("from addr", fromAddr);
    console.log("To addr", toAddrList);
    if (!fromAddr) return;
    if (!toAddrList) return;

    client
      .request(GET_FOLLOWSTATUS, {
        fromAddr: fromAddr,
        toAddr: toAddrList,
      })
      .then(res => {
        console.log("🧬🧬-CyberConnect-GET_FollowStatus-start-🧬🧬");
        console.log(res.connections);
        console.log("🧬🧬-CyberConnect-GET_FollowStatus---end-🧬🧬");
        setFollowStatus(res.connections);
      })
      .catch(err => {
        console.error(err);
      });
  }, [fromAddr, toAddrList]);

  return followStatus;
}
