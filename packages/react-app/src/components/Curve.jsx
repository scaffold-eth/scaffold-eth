import React, { useRef, useEffect } from "react";

export default function Curve(props) {
  let ref = useRef();

  const drawArrow = (ctx, x1, y1, x2, y2) => {
    let [dx, dy] = [x1 - x2, y1 - y2];
    let norm = Math.sqrt(dx * dx + dy * dy);
    let [udx, udy] = [dx / norm, dy / norm];
    const size = norm / 7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 + udx * size - udy * size, y2 + udx * size + udy * size);
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 + udx * size + udy * size, y2 - udx * size + udy * size);
    ctx.stroke();
  };

  useEffect(() => {
    let canvas = ref.current;

    const textSize = 12;

    const width = canvas.width;
    const height = canvas.height;

    if (canvas.getContext && props.ethReserve && props.tokenReserve) {
      const k = props.ethReserve * props.tokenReserve;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      let maxX = k / (props.ethReserve / 4);
      let minX = 0;

      if (props.addingEth || props.addingToken) {
        maxX = k / (props.ethReserve * 0.4);
        //maxX = k/(props.ethReserve*0.8)
        minX = k / Math.max(0, 500 - props.ethReserve);
      }

      const maxY = (maxX * height) / width;
      const minY = (minX * height) / width;

      const plotX = x => {
        return ((x - minX) / (maxX - minX)) * width;
      };

      const plotY = y => {
        return height - ((y - minY) / (maxY - minY)) * height;
      };
      ctx.strokeStyle = "#000000";
      ctx.fillStyle = "#000000";
      ctx.font = textSize + "px Arial";
      // +Y axis
      ctx.beginPath();
      ctx.moveTo(plotX(minX), plotY(0));
      ctx.lineTo(plotX(minX), plotY(maxY));
      ctx.stroke();
      // +X axis
      ctx.beginPath();
      ctx.moveTo(plotX(0), plotY(minY));
      ctx.lineTo(plotX(maxX), plotY(minY));
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.beginPath();
      let first = true;
      for (var x = minX; x <= maxX; x += maxX / width) {
        /////
        var y = k / x;
        /////
        if (first) {
          ctx.moveTo(plotX(x), plotY(y));
          first = false;
        } else {
          ctx.lineTo(plotX(x), plotY(y));
        }
      }
      ctx.stroke();

      ctx.lineWidth = 1;

      if (props.addingEth) {
        let newEthReserve = props.ethReserve + parseFloat(props.addingEth);

        ctx.fillStyle = "#bbbbbb";
        ctx.beginPath();
        ctx.arc(plotX(newEthReserve), plotY(k / newEthReserve), 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = "#009900";
        drawArrow(
          ctx,
          plotX(props.ethReserve),
          plotY(props.tokenReserve),
          plotX(newEthReserve),
          plotY(props.tokenReserve),
        );

        ctx.fillStyle = "#000000";
        ctx.fillText(
          "" + props.addingEth + " ETH input",
          plotX(props.ethReserve) + textSize,
          plotY(props.tokenReserve) - textSize,
        );

        ctx.strokeStyle = "#990000";
        drawArrow(ctx, plotX(newEthReserve), plotY(props.tokenReserve), plotX(newEthReserve), plotY(k / newEthReserve));

        let amountGained = Math.round((10000 * (props.addingEth * props.tokenReserve)) / newEthReserve) / 10000;
        ctx.fillStyle = "#000000";
        ctx.fillText(
          "" + amountGained + " 🎈 output (-0.3% fee)",
          plotX(newEthReserve) + textSize,
          plotY(k / newEthReserve),
        );
      } else if (props.addingToken) {
        let newTokenReserve = props.tokenReserve + parseFloat(props.addingToken);

        ctx.fillStyle = "#bbbbbb";
        ctx.beginPath();
        ctx.arc(plotX(k / newTokenReserve), plotY(newTokenReserve), 5, 0, 2 * Math.PI);
        ctx.fill();

        //console.log("newTokenReserve",newTokenReserve)
        ctx.strokeStyle = "#990000";
        drawArrow(
          ctx,
          plotX(props.ethReserve),
          plotY(props.tokenReserve),
          plotX(props.ethReserve),
          plotY(newTokenReserve),
        );

        ctx.fillStyle = "#000000";
        ctx.fillText(
          "" + props.addingToken + " 🎈 input",
          plotX(props.ethReserve) + textSize,
          plotY(props.tokenReserve),
        );

        ctx.strokeStyle = "#009900";
        drawArrow(
          ctx,
          plotX(props.ethReserve),
          plotY(newTokenReserve),
          plotX(k / newTokenReserve),
          plotY(newTokenReserve),
        );

        let amountGained = Math.round((10000 * (props.addingToken * props.ethReserve)) / newTokenReserve) / 10000;
        //console.log("amountGained",amountGained)
        ctx.fillStyle = "#000000";
        ctx.fillText(
          "" + amountGained + " ETH output (-0.3% fee)",
          plotX(k / newTokenReserve) + textSize,
          plotY(newTokenReserve) - textSize,
        );
      }

      ctx.fillStyle = "#0000FF";
      ctx.beginPath();
      ctx.arc(plotX(props.ethReserve), plotY(props.tokenReserve), 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [props]);

  return (
    <div style={{ position: "relative", width: props.width, height: props.height }}>
      <canvas style={{ position: "absolute", left: 0, top: 0 }} ref={ref} width={props.width} height={props.height} />
      <div style={{ position: "absolute", left: "20%", bottom: -20 }}>-- ETH Reserve --></div>
      <div
        style={{ position: "absolute", left: -20, bottom: "20%", transform: "rotate(-90deg)", transformOrigin: "0 0" }}
      >
        -- Token Reserve -->
      </div>
    </div>
  );
}
