import React from "react";
//import { useSelector } from 'react-redux'
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";

function GridSquare(props) {
    const classes = `grid-square color-${props.color}`
    return <div className={classes} 
                onClick={(e) => {
                    console.log(e.target.value)
                    
                }}
            />
}

function GridBoard(props) {

    // generates an array of 192 rows, each containing 96 GridSquares.
  
      const grid = []
      for (let row = 0; row < 256; row ++) {
          grid.push([])
          for (let col = 0; col < 256; col ++) {
              grid[row].push(
                <GridSquare 
                    key={`${col}${row}`} 
                    color="0"
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

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const gridDefault = () => {
    const rows = 256
    const cols = 256
    const array = []
  
    // Fill array with 256 arrays each containing
    // 256 zeros (0)
    for (let row = 0; row < rows; row++) {
        array.push([])
        for (let col = 0; col < cols; col++) {
          array[row].push(0)
        }
    }
  
    return array
}

export default function GridView({ yourLocalBalance, mainnetProvider, price, address }) {

    return (
        <div id="main-grid-container">
            <div className="game-header">
                <h1>Grid Owner Board</h1>
            </div>
            <GridBoard />
            
        </div>
    )
}