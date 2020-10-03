import { gql } from 'apollo-boost';

export const ARTISTS_QUERY = gql`
  query artists($address: Bytes!) {
    artists(where: { address: $address }) {
      inkCount
      address
      inks(orderBy: createdAt, orderDirection: desc) {
        jsonUrl
        limit
        count
        mintPrice
        createdAt
        sales {
          price
        }
      }
    }
  }
`;

export const INKS_QUERY = gql`
  query inks($first: Int, $skip: Int) {
    inks(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      createdAt
      jsonUrl
      artist {
        address
      }
    }
  }
`;

export const HOLDINGS_QUERY = gql`
  query tokens($owner: Bytes!) {
    tokens(where: { owner: $owner }) {
      owner
      id
      ink {
        id
        jsonUrl
        limit
        count
        artist {
          address
        }
      }
    }
  }
`;
