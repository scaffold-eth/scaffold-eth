import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeContainer = ({ language, children }) => {
  return <SyntaxHighlighter style={synthwave84} language={language} children={children} />
}

export default CodeContainer
