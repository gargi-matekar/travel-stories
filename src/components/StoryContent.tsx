// src/components/StoryContent.tsx
'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function StoryContent({ content }: { content: string }) {
  const normalized = content.replace(/^(#{1,6})([^\s#])/gm, '$1 $2')
  return (
    <div className="prose-dark max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-serif font-light text-white mt-12 mb-5">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-serif font-light text-white mt-10 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-serif font-light text-white mt-8 mb-3">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-8 mb-6 text-lg">{children}</p>
          ),
          em: ({ children }) => (
            <em className="text-sand-300 not-italic font-serif text-xl">{children}</em>
          ),
          strong: ({ children }) => (
            <strong className="text-white font-medium">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 pl-6 space-y-2 text-gray-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 pl-6 space-y-2 text-gray-300 list-decimal">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-7">{children}</li>
          ),
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg w-full my-8 aspect-video object-cover"
            />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-sand-500 pl-6 my-6 italic text-gray-400">
              {children}
            </blockquote>
          ),
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  )
}
