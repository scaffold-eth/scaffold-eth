import { gql } from 'apollo-boost';

export const ARTISTS_QUERY = gql`
  query artists($address: Bytes!) {
    artists(where: {address: $address}) {
      inkCount
      address
      inks (orderBy: createdAt, orderDirection: desc){
        inkId
        jsonUrl
        limit
        count
        createdAt
      }
    }
  }
`

export const INKS_QUERY = gql`
  query inks {
    inks(first: 5) {
      id
      inkId
      jsonUrl
    }
  }
`
