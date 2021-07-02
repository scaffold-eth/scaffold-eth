import { useEffect, useState } from 'react';
import { TokenList, TokenInfo } from '@uniswap/token-lists';

/*
  ~ What it does? ~

  


*/

/**
 * Gets a tokenlist (see more at https://tokenlists.org/), returning the .tokens only
 * 
  ~ How can I use? ~
  const tokenList = useTokenList(); <- default returns the Unsiwap tokens
  const tokenList = useTokenList("https://gateway.ipfs.io/ipns/tokens.uniswap.org");

  ~ Features ~
  - Optional - specify chainId to filter by chainId
 * @param tokenListUri 
 * @param chainId 
 * @returns 
 */
export const useTokenList = (tokenListUri: string, chainId?: string) => {
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);

  const _tokenListUri = tokenListUri || 'https://gateway.ipfs.io/ipns/tokens.uniswap.org';

  useEffect(() => {
    const getTokenList = async () => {
      try {
        const tokenListResponse = await fetch(_tokenListUri);
        const tokenList: TokenList = await tokenListResponse.json();
        let tokenInfo: TokenInfo[] = [];

        if (chainId) {
          tokenInfo = tokenList.tokens.filter(function (t: any) {
            return t.chainId === chainId;
          });
        } else {
          tokenInfo = tokenList.tokens;
        }

        setTokenList(tokenInfo);
      } catch (e) {
        console.log(e);
      }
    };
    getTokenList();
  }, [tokenListUri]);

  return tokenList;
};
