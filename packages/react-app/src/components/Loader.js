import React from 'react'

export default function Loader() {
  return (
    <div style={{margin:"0 auto",opacity:0.5,marginTop:64,width:300,border: "1px solid #999999", boxShadow: "2px 2px 8px #AAAAAA"}}>
      <img style={{maxWidth:300}} src="/loading.gif"/>
    </div>
  );
}
