import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeContainer = ({ language, children }) => {
  return (
    <span style={{ fontSize: '14px' }}>
      <SyntaxHighlighter
        style={synthwave84}
        customStyle={{ background: 'none' }}
        language={language}
        showLineNumbers
        showInlineLineNumbers
      >
        {children}
      </SyntaxHighlighter>
    </span>
  )
}

export default CodeContainer
