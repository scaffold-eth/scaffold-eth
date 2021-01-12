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
                    props.showModal(e.target.id);
                    //console.log('ID ', e.target.id);
                }}
                id={props.id}
                x={props.x}
                y={props.y}
                color={props.color}
                owner='0x0000000000000000000000000000000000000000'
            />
}

const GridBoard = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)

    
    const showModal = (id, color) => {
        //console.log(id);
        let coords = id.split('-')
        //console.log(coords)
        setX(coords[0])
        setY(coords[1])

        setIsVisible(true);
    }

    const handleOk = (x, y, color) => {
        setIsLoading(true);
        console.log('Coords ', x, y)
        // todo: get the id from the div el
        
        // the value we are paying... rn at .01
        props.tx(props.writeContracts.GridGame.buySquare(y, x, random(1, 7),
        {
            value: 10000000000000000n // .01 ETH
        }));

        setTimeout(() => {
            setIsLoading(false);
            setIsVisible(false);
        }, 2000);
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
                        x={col}
                        y={row}
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
                    onClick={() => {handleOk(x, y)}}>
                Buy Square
                </Button>,
            ]}
            >
                {/* content for modal */}
            <div>                
                New Owner: <AddressInput value={props.address} /> 
                <br />
                Square Id: {x}-{y} 
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