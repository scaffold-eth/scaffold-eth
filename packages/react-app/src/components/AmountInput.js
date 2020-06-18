import React, { useState, useEffect } from 'react'
import { DollarOutlined } from '@ant-design/icons';
import { Input, Badge } from 'antd';
const { Search } = Input;

export default function AmountInput(props) {

  const currentValue = typeof props.value != "undefined"?props.value:props.value

  let maxButton
  let Component = Input
  if(typeof props.max != "undefined"){
    maxButton = (
      <div onClick={()=>{
        props.setValue(props.max)
      }}>
        max
      </div>
    )
    Component = Search
  }

  return (
    <div>
      <Component
        enterButton="Search"
        size="large"
        autoFocus={props.autoFocus}
        placeholder={props.placeholder?props.placeholder:"amount"}
        prefix={props.prefix != "undefined" ? props.prefix : <DollarOutlined /> }
        suffix={props.suffix != "undefined" ? props.suffix : "USD" }
        value={props.value}
        enterButton={maxButton}
        onSearch={()=>{
          props.setValue(props.max)
        }}
        onChange={(e)=>{
          props.setValue(e.target.value)
        }}
      />
    </div>
  );
}
