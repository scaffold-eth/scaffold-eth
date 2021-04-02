import React from 'react'
import { PageHeader } from 'antd'

export default function Header({ extra }) {
  return (
    <PageHeader
      title={
        <div style={{ zIndex: -1, opacity: 0.5, fontSize: 12 }}>
          <a href='https://eth.dev' target='_blank' rel='noreferrer'>
            {window.innerWidth < 600 ? '👨‍💻' : '👨‍💻  eth.dev'}
          </a>
        </div>
      }
      subTitle=''
      style={{ cursor: 'pointer', fontSize: 32 }}
      extra={extra}
    />
  )
}
