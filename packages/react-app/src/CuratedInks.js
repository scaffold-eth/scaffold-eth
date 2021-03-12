import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';
import { Link } from 'react-router-dom';
import { ADMIN_INKS_QUERY } from './apollo/queries';
import { Loader } from './components';
import { isBlocklisted } from './helpers';
import { useUserProvider } from './hooks';
import './styles/inks.css';

const ADMIN_ADDRESSES = ['0x859c736870af2abe057265a7a5685ae7b6c94f15'];

export default function CuratedInks({ localProvider, injectedProvider }) {
  let [allInks, setAllInks] = useState([]);
  let [inks, setInks] = useState({});
  const userProvider = useUserProvider(localProvider, injectedProvider);
  console.log('userProvider: ', userProvider);
  const { loading, error, data, fetchMore } = useQuery(ADMIN_INKS_QUERY, {
    variables: {
      first: 48,
      skip: 0,
      admins: ADMIN_ADDRESSES,
    },
    fetchPolicy: 'no-cache',
  });

  const getMetadata = async (jsonURL) => {
    const response = await fetch('https://ipfs.io/ipfs/' + jsonURL);
    const data = await response.json();
    return data;
  };

  const getInks = (data) => {
    setAllInks([...allInks, ...data]);
    data.forEach(async (ink) => {
      if (isBlocklisted(ink.jsonUrl)) return;
      let _ink = ink;
      _ink.metadata = await getMetadata(ink.jsonUrl);
      let _newInk = {};
      _newInk[_ink.inkNumber] = _ink;
      setInks((inks) => ({ ...inks, ..._newInk }));
      //setInks((inks) => [...inks, _ink]);
    });
  };

  const onLoadMore = useCallback(() => {
    if (
      Math.round(window.scrollY + window.innerHeight) >=
      Math.round(document.body.scrollHeight)
    ) {
      fetchMore({
        variables: {
          skip: allInks.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return fetchMoreResult;
        },
      });
    }
  }, [fetchMore, allInks.length]);

  // useEffect(() => {
  //   fakeData ? getInks(fakeData.data.inks) : console.log('loading');
  //   // eslint-disable-next-line
  // }, [fakeData]);

  useEffect(() => {
    data ? getInks(data.inks) : console.log('loading');
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    window.addEventListener('scroll', onLoadMore);
    return () => {
      window.removeEventListener('scroll', onLoadMore);
    };
  }, [onLoadMore]);

  if (loading) return <Loader />;
  if (error) return `Error! ${error.message}`;

  return (
    <div className="inks-grid">
      {inks &&
        Object.keys(inks)
          .sort((a, b) => b - a)
          .map((ink) => (
            <div className="ink-item" key={inks[ink].id}>
              <Link to={'ink/' + inks[ink].id} style={{ color: 'black' }}>
                <img
                  src={inks[ink].metadata.image}
                  alt={inks[ink].metadata.name}
                />
              </Link>
            </div>
          ))}
    </div>
  );
}
