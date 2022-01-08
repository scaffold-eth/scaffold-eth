import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import shortid from 'shortid'
import $ from 'jquery'
import './styles.css'

export default function WindowModal({
  uniqueWindowId = shortid(),
  backgroundPath,
  initTop,
  initLeft,
  initWidth,
  initHeight,
  dragAreaHeightPercent,
  onFocus,
  onRequestClose,
  isOpen,
  containerStyle,
  contentContainerStyle,
  children
}) {
  useEffect(() => {
    $('.flexible-modal-drag-area').css('height', `${dragAreaHeightPercent}%`)
  }, [dragAreaHeightPercent])

  return (
    <ReactModal
      className={uniqueWindowId}
      top={initTop}
      left={initLeft}
      initHeight={initHeight}
      initWidth={initWidth}
      onFocus={onFocus}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <div
        className='background-image'
        style={{
          height: '100%',
          overflowY: 'scroll',
          background: `url(${backgroundPath})`,
          backgroundSize: '100% 100%'
        }}
      />

      <div
        className='content'
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          overflow: 'scroll',
          ...contentContainerStyle
        }}
      >
        {children}
      </div>
    </ReactModal>
  )
}
