import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import cols from '../gridstyles/cols.js'
import breakpoints from '../gridstyles/breakpoints.js'
import { Responsive, WidthProvider } from 'react-grid-layout'

// Handles the responsive nature of the grid
const ResponsiveGridLayout = WidthProvider(Responsive)

const Senders = ({}) => {
    return (
        <div>                 
            <h1>Senders Title</h1>                                    
            <ResponsiveGridLayout
            breakpoints={breakpoints}
            cols={cols}
            isDraggable={false}
            isResizable={false}            
            >	                
            <div className="grid-cell"
              key="0"
              data-grid={{ x: 0, y: 0, w: 2, h: 5 }}
            >
              Senders content...                  
            </div>   
            </ResponsiveGridLayout>                                                                                                                                 
        </div>
    )
 }

 export default Senders 