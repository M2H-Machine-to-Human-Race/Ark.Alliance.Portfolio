export type MermaidTheme = 'light' | 'dark' | 'neutral' | 'forest';

export type DiagramType =
    | 'flowchart'
    | 'sequence'
    | 'class'
    | 'state'
    | 'er'
    | 'gantt'
    | 'pie'
    | 'git'
    | 'journey'
    | 'unknown';

export type ExportFormat = 'png' | 'svg' | 'pdf';

export interface MermaidDiagramReaderProps {
    diagramSource: string;
    theme?: MermaidTheme;
    enableZoom?: boolean;
    enablePan?: boolean;
    enableExport?: boolean;
    enableFullscreen?: boolean;
    height?: string | number;
    width?: string | number;
    onNodeClick?: (nodeId: string, event: MouseEvent) => void;
    onError?: (error: Error) => void;
}

export interface MermaidNode {
    id: string;
    label: string;
    type: string;
    position?: { x: number; y: number };
}

export interface MermaidEdge {
    source: string;
    target: string;
    label?: string;
}

