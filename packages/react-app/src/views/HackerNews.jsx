import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import Text from "antd/lib/typography/Text";

export default function HackerNews({
  posts,
  comments,
}) {
  const [newPurpose, setNewPurpose] = useState("loading...");
  return (
    <div>
      <Divider/>
      <Text>Hacker News!!!</Text>
      <Divider/>
      {posts && posts.map(x =>  (<div>
          <div><Text>Data hash: {x.data_hash._hex}</Text></div>
          <div><Text>Block Number: {x.blockNumber}</Text></div>
          <div><Text>Author: {x.poster}</Text></div>
            <div>
              {comments && comments.map(y => {
                if(y.post_hash._hex !== x.data_hash._hex){
                  return null;
                }
                return <div>
                  <div><Text>-</Text></div>
                  <div><Text>Comment by {y.commenter}</Text></div>
                  <div><Text>Comment hash {y.comment_hash._hex}</Text></div>
                  </div>
              })}
            </div>
          <Divider />
          </div>)
      )}
      {!posts && <Text>No posts to display</Text>}
    </div>
  );
}
