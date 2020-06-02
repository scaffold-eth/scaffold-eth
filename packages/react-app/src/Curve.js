import React, { useRef, useEffect } from 'react';

const Curve = (props) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;

    const width = canvas.width ;
    const height = canvas.height ;

    if (canvas.getContext && props.ethReserve && props.tokenReserve) {

      const k = props.ethReserve * props.tokenReserve

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,width,height);

      let maxX = k/10
      let minX = 0

      if(props.addingEth){
        maxX = k/40
        minX = k/70
      }

      const maxY = maxX * height / width;
      const minY = minX * height / width;

      const plotX = (x)=>{
        return (x - minX) / (maxX - minX) * width ;
      }

      const plotY = (y)=>{
        return height - (y - minY) / (maxY - minY) * height ;
      }

      // +Y axis
      ctx.beginPath() ;
      ctx.moveTo(plotX(minX),plotY(0)) ;
      ctx.lineTo(plotX(minX),plotY(maxY)) ;
      ctx.stroke() ;
      // +X axis
      ctx.beginPath() ;
      ctx.moveTo(plotX(0),plotY(minY)) ;
      ctx.lineTo(plotX(maxX),plotY(minY)) ;
      ctx.stroke() ;

      ctx.lineWidth = 2 ;
      ctx.beginPath() ;
      let first = true
      for (var x = minX; x <= maxX; x += maxX/width) {
        /////
        var y = k / x
        /////
        if (first) {
          ctx.moveTo(plotX(x),plotY(y))
          first = false
        } else {
          ctx.lineTo(plotX(x),plotY(y))
        }
      }
      ctx.stroke() ;

      ctx.lineWidth = 1 ;

      ctx.fillStyle = props.addingEth?"#0000FF":"#FF0000";
      ctx.beginPath();
      ctx.arc(plotX(50),plotY(50), 5, 0, 2 * Math.PI);
      ctx.fill();

      if(props.addingEth){
        ctx.fillStyle = props.addingEth?"#00FF00":"#FF0000";
        ctx.beginPath();
        ctx.arc(plotX(props.addingEth),plotY(k/props.addingEth), 5, 0, 2 * Math.PI);
        ctx.fill();
      }

    }
  },[props]);


  return (
    <div style={{margin:32,position:'relative',width:props.width,height:props.height}}>
      <canvas
        style={{position:'absolute',left:0,top:0}}
        ref={ref}
        {...props}
      />
      <div style={{position:'absolute',left:"20%",bottom:-20}}>
        -- ETH Reserve -->
      </div>
      <div style={{position:'absolute',left:-20,bottom:"20%",transform:"rotate(-90deg)",transformOrigin:"0 0"}}>
        -- Token Reserve -->
      </div>
    </div>
  );
};

export default Curve;
