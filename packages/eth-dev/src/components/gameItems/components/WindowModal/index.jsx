import React, { useState, useEffect } from 'react'
// https://github.com/bokuweb/react-rnd
import { Rnd } from 'react-rnd'
import $ from 'jquery'

export default function WindowModal({
  backgroundPath,
  initTop,
  initLeft,
  initWidth,
  initHeight,
  dragAreaHeightPercent,
  isOpen,
  enableResizing = true,
  onDrag = () => {},
  onDragStop = () => {},
  onResizeStop = () => {},
  windowTitle = '',
  style = {},
  containerStyle,
  contentContainerStyle,
  children
}) {
  const [windowProps, setWindowProps] = useState({
    width: initWidth,
    height: initHeight,
    x: initLeft,
    y: initTop
  })

  return (
    <>
      {/* dont remove this! */}
      {isOpen && (
        <Rnd
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...style,
            visible: isOpen
          }}
          size={{ width: windowProps.width, height: windowProps.height }}
          position={{ x: windowProps.x, y: windowProps.y }}
          dragHandleClassName='draggable-header'
          onDrag={(e, direction) => {
            onDrag()
          }}
          onDragStop={(e, direction) => {
            setWindowProps({ x: direction.x, y: direction.y })
            onDragStop()
          }}
          enableResizing={enableResizing}
          onResizeStop={(e, direction, ref, delta, position) => {
            setWindowProps({
              width: ref.style.width,
              height: ref.style.height,
              ...position
            })
            onResizeStop()
          }}
          lockAspectRatio
        >
          <div
            style={{
              float: 'left',
              width: '100%',
              height: '100%',
              background: `url(${backgroundPath})`,
              backgroundSize: '100% 100%',
              imageRendering: 'pixelated',
              ...containerStyle
            }}
          >
            <div
              className='draggable-header'
              style={{
                float: 'left',
                width: '100%',
                height: `${dragAreaHeightPercent}%`,
                cursor: 'move'
              }}
            />
            <div
              className='windowTitle'
              style={{
                position: 'absolute',
                top: '8%',
                left: '54%',
                width: '31%',
                height: '3%',
                fontSize: '61%',
                color: '#16DC8C'
              }}
            >
              {windowTitle}
            </div>
            <div
              className='content'
              style={{
                float: 'left',
                width: '100%',
                height: `calc(100% - ${dragAreaHeightPercent}%)`,
                // marginBottom: windowProps.height * 0.06,
                padding: '5%',
                paddingBottom: '4%',
                overflowX: 'hidden',
                overflowY: 'auto',
                color: '#fff',
                ...contentContainerStyle
              }}
            >
              {children}
            </div>
          </div>
        </Rnd>
      )}
    </>
  )
}
