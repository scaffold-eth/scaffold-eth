import React, { useState, useEffect } from 'react'
// https://github.com/bokuweb/react-rnd
import { Rnd } from 'react-rnd'
import $ from 'jquery'
import shortid from 'shortid'

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
  windowTiteleStyle,
  contentContainerStyle,
  children
}) {
  const [windowProps, setWindowProps] = useState({
    width: initWidth,
    height: initHeight,
    x: initLeft,
    y: initTop
  })
  const [windowId, setWindowId] = useState(shortid.generate())

  const sortByZIndex = (a, b) => a.style.zIndex - b.style.zIndex

  // move clicked window in front of others
  const updateWindowCSSIndex = e => {
    const windowsSelector = '.react-draggable'
    const windowElements = $(windowsSelector) || []
    if (e) {
      const clickedWindow = $(e.target).closest(windowsSelector)

      const numberOfWindows = windowElements.length
      const windowsSortedByZIndex = windowElements.sort(sortByZIndex)

      windowsSortedByZIndex.each(function (index) {
        $(this).closest(windowsSelector).css('z-index', index)
      })

      clickedWindow.css('z-index', numberOfWindows)
    }
  }

  // always place newly opened windows in front of others
  useEffect(() => {
    const windowsSelector = '.react-draggable'
    const windowElements = $(windowsSelector) || []
    const numberOfWindows = windowElements.length

    $(`.${windowId}`).css('z-index', numberOfWindows)
  }, [isOpen])

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
            updateWindowCSSIndex(e)
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
          onClick={e => {
            updateWindowCSSIndex(e)
          }}
          className={windowId}
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
                pointerEvents: 'none',
                fontSize: '61%',
                color: '#16DC8C',
                ...windowTiteleStyle
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
