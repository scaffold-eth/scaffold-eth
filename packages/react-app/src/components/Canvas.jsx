import React, { useRef, useEffect } from 'react'

export default function Canvas (props) {

  const canvasRef = useRef(null)

  const logo = new Image();
  logo.src = "logo192.png";

  useEffect(() => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // A logo
      context.drawImage(logo,10,10,165,100)

      // Another Image...
      // context.drawImage(selectedFile, 300, 10)

      // Some Text
      context.font = "16px Times"
      context.fillStyle = "#000000";
      context.fillText("Builder: PowVT",30,125)
      context.fillText("Contact Info: abc@xyz.com",30,150)
      context.fillText("Next Web3 Conference: GeckoCon",30,175)
      context.fillText("Country: USA",30,200)

      canvas.toBlob(async function(blob) {
          var a = document.createElement('a');
          a.textContent = 'Download';
          document.body.appendChild(a);
          a.style.display = 'block';
          a.download = "iconName" + '.ico';
          a.href = window.URL.createObjectURL(blob);
          let file = new File([blob], "image.png", {type:"image/png"})
          // For adding to IPFS
          // let result = await addToIPFS(file)
          // console.log(result)
      });
  })
  
  return (
    <div >
      <h3 >Combine text/ Image in HTML with Canvas</h3 >
        <canvas ref={canvasRef} width={props.width} height={props.height}/> 
    </div>
  )
}

