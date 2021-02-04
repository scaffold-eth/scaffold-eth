import React, { useState } from "react";
import { Select, Image } from "antd";
import { usePoller } from "eth-hooks";
import { defaultTokensUrl } from "../constants";

const { Option } = Select;
// return json.tokens.filter(token => token.chainId === chainId);

export default function TokenList(props) {
  const [tokenList, setTokenList] = useState(null);
  const [token, setToken] = useState(props.token);
  console.log(token);

  const fetchTokenList = async chainId => {
    try {
      const tokens = await fetch(defaultTokensUrl[chainId]).then(response => response.json()); // need to clean up repeated
      setTokenList(tokens.tokens);
    } catch (e) {
      console.log(e);
    }
  };
  usePoller(
    () => {
      fetchTokenList(1);
    },
    props.pollTime ? props.pollTime : 100000,
  );

  return (
    <div>
      {tokenList ? (
        <Select
          style={{ width: 200 }}
          showSearch
          placeholder="Select a token"
          optionFilterProp="name"
          clearIcon
          onChange={value => {
            setToken(value);
            props.onChange(value);
          }}
          filterOption={(input, option) => option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {tokenList.map(d => (
            <Option key={d.name} value={d.address}>
              <Image width={20} src={d.logoURI} />
              {d.name}
            </Option>
          ))}
        </Select>
      ) : (
        "Loading.."
      )}
    </div>
  );
}
