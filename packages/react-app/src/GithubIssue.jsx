import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Card } from 'antd';
import { Button } from 'antd';

export const GithubIssue = (props) => {

    const handleBuy = () => {
      console.log(props);
      alert('Handle buy');
    }

    const handleSell = () => {
      console.log(props);
      alert('Handle sell');
    }

    return (
      <Card title={props.url.title} extra={<a href={props.url.html_url}>View on Github</a>} style={{ margin: 20 }}>
        <p>Issue ID: {props.url.id}</p>
        <p>Status: {props.url.state}</p>
        <p>URL: {props.url.url}</p>
        <p>Created at: {props.url.created_at}</p>
        <p>Created by: {props.url.user.login}</p>
        <p>Description: {props.url.body.substring(0, 50)}</p>
        <Button onClick={handleBuy}>
          Buy
        </Button>
        <Button onClick={handleSell}>
          Sell
        </Button>
      </Card>
    );
}
