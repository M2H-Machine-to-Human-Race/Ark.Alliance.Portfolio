/**
 * @fileoverview MarkdownRenderer Component
 * Professional-grade Markdown rendering with GitHub/Obsidian quality
 * 
 * @author Armand Richelet-Kleinberg
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import { MermaidDiagramReader } from '../generic/MermaidDiagramReader/MermaidDiagramReader';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import './MarkdownRenderer.styles.css';

export interface MarkdownRendererProps {
    /** Markdown content to render */
    content: string;
    /** Custom className */
    className?: string;
}

/**
 * MarkdownRenderer Component
 * 
 * Renders Markdown with:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists)
 * - Syntax highlighting for code blocks
 * - Math equations support (KaTeX)
 * - Mermaid diagram rendering
 * - Auto-generated heading anchors
 * - Professional styling matching site theme
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
    content,
    className = ''
}) => {
    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    rehypeHighlight,
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    rehypeKatex
                ]}
                components={{
                    // Custom component overrides
                    a: ({ node, ...props }) => (
                        <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" />
                    ),
                    img: ({ node, ...props }) => (
                        <img {...props} loading="lazy" alt={props.alt || ''} />
                    ),
                    // Handle Mermaid code blocks
                    code: ({ node, className: codeClassName, children, ...props }) => {
                        const match = /language-mermaid/.exec(codeClassName || '');
                        if (match) {
                            const code = String(children).replace(/\n$/, '');
                            return (
                                <div className="markdown-mermaid-container">
                                    <MermaidDiagramReader
                                        diagramSource={code}
                                        theme="dark"
                                        enableZoom={true}
                                        enableExport={true}
                                    />
                                </div>
                            );
                        }
                        return (
                            <code className={codeClassName} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;

