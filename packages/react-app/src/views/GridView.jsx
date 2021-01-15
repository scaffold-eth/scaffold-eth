import React, { useState, useCallback, useEffect } from "react";
import { parseEther, formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";
import { Modal, Button, Input, Row, Col, Tooltip, Select } from 'antd';

const { Option } = Select;

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const GridSquare = (props) => {
    const classes = `grid-square color-${props.color}`
    return <div className={classes} 
                onClick={(e) => {
                    // Show modal
                    props.showModal(e.target.id);
                    console.log('ID ', e.target.id);
                }}
                id={props.id}
                x={props.x}
                y={props.y}
                color={props.color}
                owner='0x0000000000000000000000000000000000000000'
                amount={0}
            />
}

const GridBoard = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [amount, setAmount] = useState()
    const [color, setColor] = useState()
    
    const showModal = (id) => {
        //console.log(id);
        let coords = id.split('-')
        //console.log(coords)
        // Set the coords from the selection
        setX(coords[0])
        setY(coords[1])
        setIsVisible(true);
    }

    const handleOk = async (x, y, amount) => {
        setIsLoading(true);

        let owner = await props.readContracts.GridGame.ownerOf(x, y);
        console.log(owner);
        
        // the value we are paying... rn at .01
        props.tx(props.writeContracts.GridGame.buySquare(x, y, color,
        {
            value: amount // .01 ETH
        })).then((result) => {
            //console.log(`Hash => https://etherscan.io/tx/${result.hash}`)
        });

        setTimeout(() => {
            setIsLoading(false);
            setIsVisible(false);
        }, 2000);
    }

    const handleCancel = () => {
        setIsVisible(false);
    }

    function handleChange(value) {
        console.log(`selected ${value}`);

        setColor(value);
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
                        key={`${row}-${col}`}
                        id={`${row}-${col}`}
                        x={row}
                        y={col}
                        tx={props.tx}
                        color={props.grid[row][col].color}
                        address={props.address}
                        showModal={showModal}
                        writeContracts={props.writeContracts}                        
                        readContracts={props.readContracts}
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
                        onClick={() => {handleOk(x, y, amount)}}>
                    Buy Square
                    </Button>,
                ]}
                >
                {/* content for modal */}
                <div>                
                    New Owner: <AddressInput value={props.address} /> 
                    <br />
                    
                    <br /> 
                    Color:
                    <Select style={{ width: 120 }} onChange={handleChange}>
                        <Option value='7'>Red</Option>
                        <Option value='3'>Blue</Option>
                        <Option value='6'>Lt Blue</Option>
                        <Option value='2'>Yellow</Option>
                        <Option value='5'>Green</Option>
                        <Option value='1'>Orange</Option>
                        <Option value='4'>Purple</Option>
                    </Select>
                </div>
                <div>
                    {/* if owned show the owners address and value */}
                </div>
            </Modal>
        </div>
    )
}

const GridView = ({ address, localProvider, mainnetProvider, grid, writeContracts, readContracts, tx }) => {        
    return (
        <div id="main-container">
            <div id="main-grid-container" style={{ width: 400, margin: 'auto' }}>
                <div className="game-header">
                    <h1>🏁 Grid 🏁</h1>
                </div>
                <div id="grid-board-container">
                    <GridBoard 
                        address={address} 
                        grid={grid} 
                        readContracts={readContracts} 
                        writeContracts={writeContracts} 
                        tx={tx} 
                    />  
                </div>           
                    
            </div>
            <div id="control-panel">
                
            </div>
        </div> 
    )
}

export default GridView;