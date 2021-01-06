import React, { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";
import { Modal, Button } from 'antd';


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
              id: col + '-' + row,
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
   

    function isOwned(square) {
        
    }



    const classes = `grid-square color-${props.color}`
    return <div className={classes} 
                onClick={(e) => {
                    // Show modal??
                    console.log(e.target);
                    console.log(e.target.id);
                    // filter the grid for the one you want
                    let result = theGrid.find(el => el.id = e.target.id);
                    let chosenSquare = result.find(el => el.id = e.target.id);

                    props.showModal();

                    console.log(chosenSquare);
                    
                    // identify the grid-square
                    // for(var y = 0; y < 64; y++){
                    //     for(var x = 0; x < 64; x++){

                    //     }
                    // }
                    // is it owned?

                    // buy it

                    // update the color

                    setBlockStatus(props.address);
                }}
                id={props.id}
            />
}

function GridBoard(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const showModal = () => {
        setIsVisible(true);
    }

    const handleOk = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsVisible(false);
        }, 3000);
    }

    const handleCancel = () => {
        setIsVisible(false);
    }

    // generates an array of 64 rows, each containing 64 GridSquares.
  
      const grid = []
      for (let row = 0; row < 64; row ++) {
          grid.push([])
          for (let col = 0; col < 64; col ++) {
              grid[row].push(
                <GridSquare 
                    key={`${col}-${row}`}
                    id={`${col}-${row}`} 
                    color={6}
                    address={props.address}
                    showModal={showModal}
                />
            )
          }
      }
  
    // The components generated in makeGrid are rendered in div.grid-board
  
      return (
          <div className='grid-board'>
              {grid}
              <Modal
                visible={isVisible}
                title="Buy/Sell A Square"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                    Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={isLoading} onClick={handleOk}>
                    Submit
                    </Button>,
                ]}
                >
                    {/* content for modal */}
                <div>

                </div>
            </Modal>
          </div>
      )
}

const SquareModal = (props) => {

    return (<></>);
}


export default function GridView({ address, localProvider, mainnetProvider }) {
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