import { AlignCenterOutlined } from "@ant-design/icons";
import add from "ipfs-http-client/src/add";
import React, {useEffect, useRef} from "react";
export default function Generator(props) {

    const canvasRef = useRef(null);
    
    useEffect(() => {
        console.log("props:" + props.address);

        //console.log("generator address:" + this.props.address.toString());
        const path = process.env.PUBLIC_URL + '/generate.wasm';
        const publicKey = new String("0xdd50235d3EbA363Be8890baf05974823aCDda188");
        //console.log(this.publicKey);
        const DENSITY = 4; // how many bytes per pixel for our image (RGBA)
        const RESERVED_MEM = 3000;
        const PAGE_SIZE = 65536;
        const MAX_PARAMETERS = 5;
        //this.props.publicKey;

        var propertyIndex = 0;

        // size the WASM memory object
        var arraySize = RESERVED_MEM; // add a page worth of memory for Log Values (20 bytes), Keys->colour (20 bytes), Message (65 bytes), log messages (?? bytes)
        arraySize = arraySize + (props.width*props.height*DENSITY);
        //console.log("arraySize: " + arraySize);

        const nPages = Math.ceil(arraySize / PAGE_SIZE);
        //console.log("nPages: " + nPages);

        const memory = new WebAssembly.Memory({ initial: nPages, maximum: nPages });

        // memory that is being passed in to the WASM module
        // reserve these slots for log value entries (for debugging)
        var dv = new DataView(memory.buffer);
        dv.setInt32(propertyIndex,props.width,true); // default the values to zero
        propertyIndex = propertyIndex+DENSITY;
        dv.setInt32(propertyIndex,props.height,true); // default the values to zero
        propertyIndex = propertyIndex+DENSITY;

        var i = 0
        while (i < MAX_PARAMETERS){
            dv.setInt32(propertyIndex,0,true);
            propertyIndex=propertyIndex+DENSITY;
            i++;
        }
        //console.log("parameters loaded: " + propertyIndex);

        var keyVal = publicKey.slice(2); // slice the 0x off, we don't use it

        // load the colour pallet
        //0xAA_BB_GG_RR
        while (keyVal.length > 0){
            //console.log(keyVal.length);
            dv.setInt8(propertyIndex,parseInt(keyVal.slice(6,8),16));     //3f
            dv.setInt8(propertyIndex+1,parseInt(keyVal.slice(4,6),16));   //e4
            dv.setInt8(propertyIndex+2,parseInt(keyVal.slice(2,4),16));   //ee
            dv.setInt8(propertyIndex+3,parseInt(keyVal.slice(0,2),16));   //e5
            //console.log("0x"+keyVal.slice(6,8)+"_"+keyVal.slice(4,6)+"_"+keyVal.slice(2,4)+"_"+keyVal.slice(0,2));
            keyVal = keyVal.slice(8,keyVal.length);
            propertyIndex=propertyIndex+DENSITY;
        }

        //console.log("colours loaded: " + propertyIndex);

        var complexity = Math.floor(Math.random()*10000);
        dv.setUint8(propertyIndex,complexity,true);
        //console.log("complexity loaded: " + propertyIndex);
        propertyIndex=propertyIndex+1;

        var colourMode = [0,1,2]; //nochange, increaseTransparency, decreaseTransparency
        dv.setUint8(propertyIndex,colourMode[0],true);
        //console.log("colourMode loaded: " + propertyIndex);
        propertyIndex=propertyIndex+1;

        var debugMode = [0,1,2]; // off, info, full
        dv.setUint8(propertyIndex,debugMode[0],true);
        //console.log("debugMode loaded: " + propertyIndex);
        propertyIndex=propertyIndex+1;
        
        // items imported into WASM for processing
        const importObject = {
            env: {
                mem: memory,
                print: function (str_pos) {
                    //console.log("position: " + str_pos);
                    const str_len = new Uint8Array(memory.buffer, str_pos, 1)[0];
                    const attributeCount = new Uint8Array(memory.buffer, str_pos+1, 1)[0];
                    const bytes = new Uint8Array(memory.buffer,	str_pos + 2, str_len);
                    const log_string = new TextDecoder('utf8').decode(bytes);
                    
                    // error values start after canvaswidth and canvasheight
                    const parameters = new Uint32Array(memory.buffer, 8, 5);
                    
                    // parameters
                    var paramString =  log_string + "(";
                    for (i = 0 ; i < attributeCount ; i++){
                        paramString = paramString + parameters[i].toString(10) + ",";
                    }
                    paramString = paramString.slice(0,paramString.length-1);
                    paramString = paramString + ")";
                    console.log(paramString);
                }   
            }
        }
    
        WebAssembly.instantiateStreaming(fetch(path), importObject).then(obj => {
            const canvas = canvasRef.current;
            obj.instance.exports.initialize();
            obj.instance.exports.generate();
            const ctx = canvas.getContext("2d");
            const byteArray = new Uint8ClampedArray(memory.buffer, RESERVED_MEM, props.width * props.height * DENSITY );
            const img = new ImageData( byteArray, props.width, props.height );
            ctx.putImageData( img, 0, 0 );
        });

        }, []);

    return(<canvas ref={canvasRef} {...props}/>);
   
};