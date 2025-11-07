'use client'

import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function MarkdownRenderer({ content }) {
  return (
    <Markdown
      rehypePlugins={[remarkGfm]}
      components={{
        heading1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold my-4" {...props} />
        ),
        heading2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold my-3" {...props} />
        ),
        heading3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold my-2" {...props} />
        ),
        ul({ node, ...props }) {
          return <ul className="list-disc ml-4 my-2 space-y-1" {...props} />
        },
        ol({ node, ...props }) {
          return <ol className="list-decimal ml-4 my-2 space-y-1" {...props} />
        },
        li({ node, ...props }) {
          return <li className="my-1" {...props} />
        },
        blockquote({ node, ...props }) {
          return (
            <blockquote
              className="border-l-4 border-gray-500 pl-4 my-4 italic text-gray-300"
              {...props}
            />
          )
        },
        em({ node, ...props }) {
          return <em className="italic" {...props} />
        },
        strong({ node, ...props }) {
          return <strong className="font-bold" {...props} />
        },
        p({ node, ...props }) {
          return <p className="my-2 leading-relaxed" {...props} />
        },
        inlineCode({ node, ...props }) {
          return (
            <code
              className="bg-gray-800 rounded px-1 py-0.5 text-sm font-mono"
              {...props}
            />
          )
        },
        a({ node, ...props }) {
          return (
            <a
              className="text-blue-400 hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          )
        },
        hr({ node, ...props }) {
          return <hr className="my-4 border-gray-600" {...props} />
        },
        code(props) {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={vscDarkPlus}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          )
        },
        table({ node, ...props }) {
          return (
            <table
              className="border border-gray-600 rounded-md px-2 py-1 my-2 overflow-x-auto"
              {...props}
            />
          )
        },
        th({ node, ...props }) {
          return (
            <th
              className="border border-gray-600 bg-gray-800 px-2 py-1 text-left"
              {...props}
            />
          )
        },
        td({ node, ...props }) {
          return (
            <td className="border border-gray-600 px-2 py-1" {...props} />
          )
        },
      }}
    >
      {content}
    </Markdown>
  )
}
