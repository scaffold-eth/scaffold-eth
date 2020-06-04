import React, { useRef, useEffect } from 'react';

const Curve = (props) => {
  let ref = useRef();

  useEffect(() => {
    let canvas = ref.current;

    const textSize = 16

    const width = canvas.width ;
    const height = canvas.height ;

    if (canvas.getContext && props.ethReserve && props.tokenReserve) {

      const k = props.ethReserve * props.tokenReserve

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,width,height);

      let maxX = k/(props.ethReserve/4)
      let minX = 0

      if(props.addingEth||props.addingToken){
        maxX = k/(props.ethReserve*0.4)
        //maxX = k/(props.ethReserve*0.8)
        minX = k/Math.max(0,(500-props.ethReserve))
      }

      const maxY = maxX * height / width;
      const minY = minX * height / width;

      const plotX = (x)=>{
        return (x - minX) / (maxX - minX) * width ;
      }

      const plotY = (y)=>{
        return height - (y - minY) / (maxY - minY) * height ;
      }
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.font = textSize+"px Arial";
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



      if(props.addingEth){

        let newEthReserve = props.ethReserve + parseFloat(props.addingEth)
        //console.log("newEthReserve",newEthReserve)

        ctx.strokeStyle = "#009900";
        ctx.beginPath();
        ctx.moveTo(plotX(props.ethReserve),plotY(props.tokenReserve)) ;
        ctx.lineTo(plotX(newEthReserve),plotY(props.tokenReserve)) ;
        ctx.stroke() ;

        let fee = Math.round(props.addingEth * 997) / 100000


        ctx.fillStyle = "#009900";
        ctx.fillText(""+props.addingEth+" ETH input", plotX(props.ethReserve)+textSize, plotY(props.tokenReserve)-textSize);

        ctx.strokeStyle = "#990000";
        ctx.beginPath();
        ctx.moveTo(plotX(newEthReserve),plotY(props.tokenReserve)) ;
        ctx.lineTo(plotX(newEthReserve),plotY(k/(newEthReserve))) ;
        ctx.stroke() ;

        let amountGained =  Math.round(10000 * ( props.addingEth * props.tokenReserve ) / ( newEthReserve ) ) /10000
        //console.log("amountGained",amountGained)

        ctx.fillStyle = "#990000";
        ctx.fillText(""+(amountGained)+" Token output (minus fee)", plotX(newEthReserve)+textSize,plotY(k/(newEthReserve)));

        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        //console.log("props.ethReserve",props.ethReserve,"props.addingEth",props.addingEth)
        ctx.arc(plotX(newEthReserve),plotY(k/(newEthReserve)), 5, 0, 2 * Math.PI);
        ctx.fill();

      }else if(props.addingToken){

        let newTokenReserve = props.tokenReserve + parseFloat(props.addingToken)
        //console.log("newTokenReserve",newTokenReserve)
        ctx.strokeStyle = "#990000";
        ctx.beginPath();
        ctx.moveTo(plotX(props.ethReserve),plotY(newTokenReserve)) ;
        ctx.lineTo(plotX(props.ethReserve),plotY(props.tokenReserve)) ;
        ctx.stroke() ;

        ctx.fillStyle = "#990000";
        ctx.fillText(""+(props.addingToken)+" Token input", plotX(props.ethReserve)+textSize,plotY(props.tokenReserve));

        ctx.strokeStyle = "#009900";
        ctx.beginPath();
        ctx.moveTo(plotX(props.ethReserve),plotY(newTokenReserve)) ;
        ctx.lineTo(plotX(k/(newTokenReserve)),plotY(newTokenReserve)) ;
        ctx.stroke() ;

        let amountGained =  Math.round(10000 * ( props.addingToken * props.ethReserve ) / ( newTokenReserve ) ) /10000
        //console.log("amountGained",amountGained)
        ctx.fillStyle = "#009900";
        ctx.fillText(""+amountGained+" ETH output (minus fee)", plotX(k/(newTokenReserve))+textSize,plotY(newTokenReserve)-textSize);

        ctx.fillStyle = "#FF0000";
        ctx.beginPath();
        //console.log("props.tokenReserve",props.tokenReserve,"props.addingToken",props.addingToken)

        ctx.arc(plotX(k/(newTokenReserve)),plotY(newTokenReserve), 5, 0, 2 * Math.PI);
        ctx.fill();
      }

      ctx.fillStyle = "#0000FF"
      ctx.beginPath();
      ctx.arc(plotX(props.ethReserve),plotY(props.tokenReserve), 5, 0, 2 * Math.PI);
      ctx.fill();

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
