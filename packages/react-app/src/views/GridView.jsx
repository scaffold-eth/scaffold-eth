import React, { useState, useCallback, useEffect } from "react";
import { parseEther, formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";
import { Modal, Button, InputNumber } from 'antd';


const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const GridSquare = (props) => {
    const classes = `grid-square color-${props.color}`
    return <div className={classes} 
                onClick={(e) => {
                    // Show modal
                    props.showModal();
                    console.log(e.target);
                }}
                id={props.id}
                color={props.color}
                owner='0x0000000000000000000000000000000000000000'
            />
}

const GridBoard = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    //const [selectedSquare, setSelectedSquare] = useState();

    const showModal = () => {
        setIsVisible(true);
    }

    const handleOk = (e) => {
        setIsLoading(true);
        console.log(e.target.value);
        // todo: need to pass in the id from the grid and 
        // the value we are paying... rn at .01
        props.tx(props.writeContracts.GridGame.buySquare(random(0, 7), random(0, 7), random(1, 7),
        {
            value: 10000000000000000n // .01 ETH
        }));

        setTimeout(() => {
            setIsLoading(false);
            setIsVisible(false);
        }, 3000);
    }

    const handleCancel = () => {
        setIsVisible(false);
    }

    // generates an array of 8 rows, each containing 8 GridSquares.
    
    const gridDisplay = []
    if (props.grid){
        for (let row = 0; row < 8; row ++) {
            gridDisplay.push([])
            for (let col = 0; col < 8; col ++) {
                if(props.grid[row] && props.grid[row][col]){                    
                    gridDisplay[row].push(
                    <GridSquare 
                        key={`${col}-${row}`}
                        id={`${col}-${row}`} 
                        color={props.grid[row][col].color}
                        address={props.address}
                        showModal={showModal}
                        writeContracts={props.writeContracts}
                        tx={props.tx}
                    />
                    )
                }
            }
        }
    }
  
    return (
        <div className='grid-board'>
            {gridDisplay}
            <Modal
            visible={isVisible}
            title="Buy/Sell A Square"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                Cancel
                </Button>,
                <Button 
                    value={props.id} 
                    id={props.id} 
                    key="submit" 
                    type="primary" 
                    loading={isLoading} 
                    onClick={handleOk}>
                Buy Square
                </Button>,
            ]}
            >
                {/* content for modal */}
            <div>                
                New Owner: <AddressInput value={props.address} /> 
                <br />
                Square Id: {'0-0'} 
                <br /> 
                Color: {props.color}             
            </div>
        </Modal>
        </div>
    )
}

const GridView = ({ address, localProvider, mainnetProvider, grid, writeContracts, tx }) => {        
    return (
        <div id="main-grid-container">
            <div className="game-header">
                <h1>The Grid 🏁</h1>
            </div>
            <GridBoard address={address} grid={grid} writeContracts={writeContracts} tx={tx} />            
        </div>
    )
}

export default GridView;