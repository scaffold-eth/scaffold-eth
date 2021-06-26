import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import $ from 'jquery'
import './styles.css'

export default function WindowModal({
  uniqueWindowId,
  backgroundPath,
  initWidth,
  initHeight,
  initTop,
  initLeft,
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
      initWidth={initWidth}
      initHeight={initHeight}
      onFocus={onFocus}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      top={initTop}
      left={initLeft}
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
