import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeContainer = ({ language, children, ...props }) => {
  return (
    <span style={{ fontSize: '14px' }}>
      <SyntaxHighlighter
        style={synthwave84}
        customStyle={{ background: 'none' }}
        language={language}
        showLineNumbers
        showInlineLineNumbers
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </span>
  )
}

export default CodeContainer
