import React, {Component} from "react";
import { Button } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";
const wasm = import("./WASM/generate.wasm");

class Canvas extends Component {

    componentDidMount() {
        wasm.then(wasm => {
      
      
      const mandelIterWASM = wasm._Z10mandelIterffi;
      let canvas = this.refs.canvas.getContext('2d');
      let mag = 200;
      let panX = 2;
      let panY = 1.25;
      let maxIter = 100;
  
      for (let x = 10; x < this.props.height; x++)  {
        for (let y = 10; y < this.props.width; y++)  {
          let m = mandelIterWASM(x/mag - panX, y/mag - panY, maxIter);
          canvas.fillStyle = (m === 0) ? '#000' : 'hsl(0, 100%, ' + m + '%)';
          canvas.fillRect(x, y, 1,1);
        }
      }
    });
    }
  
    render() {
      return (
          <canvas ref="canvas"  width={this.props.width} height={this.props.height}/>
      )
    }
  }
  
  export default Canvas;