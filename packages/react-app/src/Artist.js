import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Query, useQuery } from 'react-apollo'
import { ARTISTS_QUERY } from "./apollo/queries"


export default function Artist(props) {
   let { address } = useParams();
   const { loading, error, data } = useQuery(ARTISTS_QUERY, {
    variables: {address: address},
  })
  const [artistInks, setArtistInks] = useState([])
  const [images, setImages] = useState([])

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  
    return (
            <div>
                <h1>Artist: {address}</h1>
                {JSON.stringify(data.artists[0].inks)}
            </div>
    )
}
