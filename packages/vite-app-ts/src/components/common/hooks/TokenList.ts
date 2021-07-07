import { TokenInfo, TokenList } from '@uniswap/token-lists';
import axios from 'axios';
import { useState, useEffect } from 'react';

/**
 * Gets a tokenlist (see more at https://tokenlists.org/), returning the .tokens only
 * 
 * ~ How can I use? ~
  const tokenList = useTokenList(); <- default returns the Unsiwap tokens
  const tokenList = useTokenList("https://gateway.ipfs.io/ipns/tokens.uniswap.org");
 * @param tokenListUri 
 * @param chainId 
 * @returns 
 */
export const useTokenList = (
  tokenListUri: string = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
  chainId?: number
): TokenInfo[] => {
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  useEffect(() => {
    const getTokenList = async () => {
      try {
        const tokenList: TokenList = (await axios(tokenListUri)).data;
        if (tokenList != undefined) {
          let tokenInfo: TokenInfo[] = [];

          if (chainId) {
            tokenInfo = tokenList.tokens.filter(function (t: TokenInfo) {
              return t.chainId === chainId;
            });
          } else {
            tokenInfo = tokenList.tokens;
          }

          setTokenList(tokenInfo);
        }
      } catch (e) {
        console.log(e);
      }
    };
    void getTokenList();
  }, [chainId, tokenListUri]);

  return tokenList;
};
