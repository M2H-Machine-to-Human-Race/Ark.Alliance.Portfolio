import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { cn } from '../../utils/cn';

interface ContentRendererProps {
    content: string;
    className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, className }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [renderId, setRenderId] = useState(0);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'monospace'
        });
    }, []);

    useEffect(() => {
        if (mermaidRef.current) {
            mermaid.run({
                nodes: mermaidRef.current.querySelectorAll('.mermaid')
            });
        }
    }, [content, renderId]);

    // Simple Markdown Parser (Headers, Lists, Code Blocks)
    const parseMarkdown = (text: string) => {
        // Pre-process common markdown issues if needed
        const lines = text.split('\n');
        const elements: JSX.Element[] = [];
        let inMermaidBlock = false;
        let mermaidCode = '';
        let key = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Mermaid Detection
            if (line.trim().startsWith('```mermaid')) {
                inMermaidBlock = true;
                mermaidCode = '';
                continue;
            }
            if (inMermaidBlock && line.trim().startsWith('```')) {
                inMermaidBlock = false;
                elements.push(
                    <div key={`mermaid-${key++}`} className="mermaid my-8 bg-slate-900/50 p-6 rounded-xl overflow-x-auto flex justify-center border border-slate-800 shadow-inner">
                        {mermaidCode}
                    </div>
                );
                continue;
            }
            if (inMermaidBlock) {
                mermaidCode += line + '\n';
                continue;
            }

            // Headers
            if (line.startsWith('### ')) {
                elements.push(<h3 key={key++} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-slate-800 pb-2">{line.replace('### ', '')}</h3>);
            } else if (line.startsWith('#### ')) {
                elements.push(<h4 key={key++} className="text-xl font-semibold text-blue-400 mt-6 mb-3">{line.replace('#### ', '')}</h4>);
            }
            // Lists
            else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                elements.push(<li key={key++} className="ml-6 text-slate-300 list-disc marker:text-blue-500 mb-1">{line.replace(/^[\*\-]\s/, '')}</li>);
            }
            else if (line.trim().match(/^\d+\.\s/)) {
                elements.push(<li key={key++} className="ml-6 text-slate-300 list-decimal marker:text-blue-500 mb-1">{line.replace(/^\d+\.\s/, '')}</li>);
            }
            // Paragraphs
            else if (line.trim() !== '') {
                const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
                const paragraph = (
                    <p key={key++} className="text-slate-300 mb-4 leading-relaxed text-base">
                        {parts.map((part, idx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={idx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                                return <em key={idx} className="text-blue-200 italic">{part.slice(1, -1)}</em>;
                            }
                            if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={idx} className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700">{part.slice(1, -1)}</code>;
                            }
                            return part;
                        })}
                    </p>
                );
                elements.push(paragraph);
            }
        }
        return elements;
    };

    return (
        <div className={cn("content-renderer space-y-4", className)} ref={mermaidRef}>
            {parseMarkdown(content)}
        </div>
    );
};

