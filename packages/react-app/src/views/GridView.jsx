import React, { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";


const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const gridDefault = () => {
    const rows = 64
    const cols = 64
    const array = []
  
    // Fill array with 256 arrays each containing
    // 256 zeros (0)
    for (let row = 0; row < rows; row++) {
        array.push([]);
        for (let col = 0; col < cols; col++) {
          array[row].push({
              x: col, 
              y: row, 
              owner: '0x', 
              forSale: true, 
              color: random(1, 6) 
            });
        }
    }
  
    return array;
}

let theGrid = gridDefault();

function GridSquare(props) {
    const [blockStatus, setBlockStatus] = useState(0);


    const classes = `grid-square color-${props.color}`
    return <div className={classes} 
                onClick={(e) => {
                    // Show modal??
                    console.log(e.target);
                    console.log(e.target.id);
                    // filter the grid for the one you want
                    let result = theGrid.filter((item) => {
                        //console.log(item)
                        return item.id == e.target.id
                        
                    })
                    console.log(result)
                    theGrid.map((item, index) => {
                        console.info(item)
                    })

                    // identify the grid-square

                    // is it owned?

                    // buy it

                    // update the color

                    setBlockStatus(props.address);
                }}
                id={props.id}
            />
}

function GridBoard(props) {

    // generates an array of 256 rows, each containing 256 GridSquares.
  
      const grid = []
      for (let row = 0; row < 64; row ++) {
          grid.push([])
          for (let col = 0; col < 64; col ++) {
              grid[row].push(
                <GridSquare 
                    key={`${col}-${row}`}
                    id={`${col}-${row}`} 
                    color="0"
                    address={props.address}
                />
            )
          }
      }
  
    // The components generated in makeGrid are rendered in div.grid-board
  
      return (
          <div className='grid-board'>
              {grid}
          </div>
      )
}


export default function GridView({ address, localProvider, mainnetProvider  }) {
    const [gridArray, setGridArray] = useState([])






    return (
        <div id="main-grid-container">
            <div className="game-header">
                <h1>Grid Owner Board</h1>
            </div>
            <GridBoard address={address} />
            
        </div>
    )
}