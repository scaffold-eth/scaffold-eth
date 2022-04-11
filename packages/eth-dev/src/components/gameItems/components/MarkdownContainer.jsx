/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { synthwave84 } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MarkdownContainer = ({ language, children, ...props }) => {
  // https://stackoverflow.com/questions/65807962/how-to-apply-code-highlights-within-markdown-to-jsx-package-in-react
  const CodeBlock = ({ className, children }) => {
    let lang = 'text' // default monospaced text
    if (className && className.startsWith('lang-')) {
      lang = className.replace('lang-', '')
    }

    if (lang === 'sh') lang = 'bash'

    console.log({ props })

    return (
      <span style={{ fontSize: '14px' }}>
        <SyntaxHighlighter
          style={synthwave84}
          customStyle={{ background: 'none' }}
          language={lang}
          showLineNumbers
          showInlineLineNumbers
          {...props}
        >
          {children}
        </SyntaxHighlighter>
      </span>
    )
  }

  // markdown-to-jsx uses <pre><code/></pre> for code blocks.
  const PreBlock = ({ children, className, ...rest }) => {
    if ('type' in children && children.type === 'code') {
      return CodeBlock(children.props)
    }
    return <pre {...rest}>{children}</pre>
  }

  return (
    <Markdown
      options={{
        forceWrapper: false,
        overrides: {
          // overwrite code blocks to use <SyntaxHighlighter />
          pre: PreBlock,
          // overwrite links to always open in new tab
          a: {
            // component: a,
            props: {
              target: '_blank'
            }
          }
        }
      }}
    >
      {children}
    </Markdown>
  )
}

export default MarkdownContainer
