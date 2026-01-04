import { BaseComponentModel } from '../../base/BaseComponent.model';
import mermaid from 'mermaid';
import { MermaidTheme, DiagramType, ExportFormat } from './MermaidDiagramReader.types';
import React from 'react';

export class MermaidDiagramReaderViewModel extends BaseComponentModel {
    // State
    private _diagramSource: string;
    private _theme: MermaidTheme = 'light';
    private _zoom: number = 1;
    private _panX: number = 0;
    private _panY: number = 0;
    private _isFullscreen: boolean = false;
    private _diagramType: DiagramType | null = null;
    private _renderedSVG: string | null = null;

    // Callbacks
    public onNodeClickCallback?: (nodeId: string, event: MouseEvent) => void;

    // Refs (Assigned by hook/component)
    public containerRef: React.RefObject<HTMLDivElement | null> = React.createRef();
    public diagramRef: React.RefObject<HTMLDivElement | null> = React.createRef();

    constructor(diagramSource: string, theme: MermaidTheme = 'light') {
        super();
        this._diagramSource = diagramSource;
        this._theme = theme;
        // Don't initialize mermaid in constructor to avoid side-effects before mount, do it in init
    }

    // Initialization
    private initializeMermaid(): void {
        mermaid.initialize({
            startOnLoad: false, // We control rendering
            theme: this._theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
            logLevel: 'error',
            // Enhanced dark theme configuration
            themeVariables: this._theme === 'dark' ? {
                // Primary colors matching site theme
                primaryColor: '#6366f1',
                primaryTextColor: '#e2e8f0',
                primaryBorderColor: '#8b5cf6',
                lineColor: '#94a3b8',
                secondaryColor: '#141b3d',
                tertiaryColor: '#1e2749',

                // Background colors
                background: '#0a0e27',
                mainBkg: '#141b3d',
                secondBkg: '#1e2749',
                tertiaryBkg: '#0a0e27',

                // Text colors
                textColor: '#e2e8f0',
                secondaryTextColor: '#94a3b8',

                // Node styling
                nodeBorder: '#8b5cf6',
                clusterBkg: '#1e2749',
                clusterBorder: '#6366f1',

                // Edge styling
                edgeLabelBackground: '#141b3d',

                // Flowchart specific
                labelBoxBkgColor: '#141b3d',
                labelBoxBorderColor: '#6366f1',

                // Sequence diagram
                actorBkg: '#141b3d',
                actorBorder: '#6366f1',
                actorTextColor: '#e2e8f0',
                actorLineColor: '#94a3b8',
                signalColor: '#e2e8f0',
                signalTextColor: '#e2e8f0',
                labelBoxBgColor: '#1e2749',
                labelTextColor: '#e2e8f0',
                loopTextColor: '#e2e8f0',
                noteBorderColor: '#8b5cf6',
                noteBkgColor: '#1e2749',
                noteTextColor: '#e2e8f0',

                // State diagram
                stateBkg: '#141b3d',
                stateBorder: '#6366f1',
                stateLabelColor: '#e2e8f0',

                // Class diagram
                classText: '#e2e8f0',

                // Git graph
                git0: '#6366f1',
                git1: '#8b5cf6',
                git2: '#ec4899',
                git3: '#f59e0b',
                git4: '#10b981',
                git5: '#3b82f6',
                git6: '#14b8a6',
                git7: '#f97316'
            } : {
                // Light theme variables (default)
                primaryColor: '#6366f1',
                primaryTextColor: '#1e293b',
                primaryBorderColor: '#8b5cf6'
            },
            // Diagram-specific configurations
            flowchart: {
                curve: 'basis',
                padding: 20,
                nodeSpacing: 50,
                rankSpacing: 50,
                diagramPadding: 20,
                htmlLabels: true
            },
            sequence: {
                actorMargin: 50,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdj: 1,
                useMaxWidth: true,
                rightAngles: false,
                showSequenceNumbers: false
            },
            gantt: {
                titleTopMargin: 25,
                barHeight: 20,
                barGap: 4,
                topPadding: 50,
                leftPadding: 75,
                gridLineStartPadding: 35,
                fontSize: 11,
                numberSectionStyles: 4,
                axisFormat: '%Y-%m-%d'
            }
        });
    }

    // Lifecycle
    public async onInit(): Promise<void> {
        this.initializeMermaid();
        await this.renderDiagram();
        this.detectDiagramType();
    }

    public onDestroy(): void {
        this.cleanup();
    }

    // Core Methods
    public async renderDiagram(): Promise<void> {
        try {
            this.isLoading = true;

            // Need a unique ID for mermaid render
            const id = `mermaid-${Date.now()}`;

            // Mermaid render returns { svg }
            const { svg } = await mermaid.render(
                id,
                this._diagramSource
            );

            this._renderedSVG = svg;

            if (this.diagramRef.current) {
                this.diagramRef.current.innerHTML = svg;
                this.attachNodeListeners();
            }

            this.isLoading = false;
        } catch (error) {
            console.error(error);
            this.error = (error as Error).message;
            this.isLoading = false;
        }
    }

    private detectDiagramType(): void {
        const firstLine = this._diagramSource.trim().split('\n')[0].toLowerCase();

        if (firstLine.includes('flowchart') || firstLine.includes('graph')) {
            this._diagramType = 'flowchart';
        } else if (firstLine.includes('sequencediagram')) {
            this._diagramType = 'sequence';
        } else if (firstLine.includes('classdiagram')) {
            this._diagramType = 'class';
        } else if (firstLine.includes('statediagram')) {
            this._diagramType = 'state';
        } else if (firstLine.includes('erdiagram')) {
            this._diagramType = 'er';
        } else if (firstLine.includes('gantt')) {
            this._diagramType = 'gantt';
        } else if (firstLine.includes('pie')) {
            this._diagramType = 'pie';
        } else {
            this._diagramType = 'unknown';
        }
    }

    // Zoom Controls
    public zoomIn(): void {
        this._zoom = Math.min(this._zoom + 0.1, 3); // Max 300%
    }

    public zoomOut(): void {
        this._zoom = Math.max(this._zoom - 0.1, 0.1); // Min 10%
    }

    public fitToScreen(): void {
        this._zoom = 1;
        this._panX = 0;
        this._panY = 0;
    }

    // Pan Controls
    public handleWheel = (event: React.WheelEvent): void => {
        // Prevent default scroll behavior if zooming
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            const delta = event.deltaY > 0 ? -0.05 : 0.05;
            this._zoom = Math.max(0.1, Math.min(3, this._zoom + delta));
        }
    };

    public handleMouseDown = (event: React.MouseEvent): void => {
        // Implement pan on drag
        event.preventDefault(); // Prevent text selection
        let startX = event.clientX - this._panX;
        let startY = event.clientY - this._panY;

        const handleMouseMove = (e: MouseEvent) => {
            this._panX = e.clientX - startX;
            this._panY = e.clientY - startY;
            // We need to trigger a re-render in the view, usually handled via ViewModel hook binding
            // But since we are modifying public props, the hook will pick it up if we notify
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Theme
    public toggleTheme(): void {
        this._theme = this._theme === 'light' ? 'dark' : 'light';
        this.initializeMermaid();
        this.renderDiagram();
    }

    // Fullscreen
    public toggleFullscreen(): void {
        if (!this._isFullscreen) {
            this.containerRef.current?.requestFullscreen();
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
        this._isFullscreen = !this._isFullscreen;
    }

    // Export Methods
    public async exportAsPNG(): Promise<void> {
        const svg = this.diagramRef.current?.querySelector('svg');
        if (!svg) return;

        // Convert SVG to PNG using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        // Create a blob URL for sanity
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.fillStyle = this._theme === 'dark' ? '#1e1e1e' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        this.downloadBlob(blob, 'diagram.png');
                    }
                });
            }
            URL.revokeObjectURL(url);
        };

        img.src = url;
    }

    public exportAsSVG(): void {
        if (!this._renderedSVG) return;

        const blob = new Blob([this._renderedSVG], { type: 'image/svg+xml' });
        this.downloadBlob(blob, 'diagram.svg');
    }

    public async exportAsPDF(): Promise<void> {
        console.log('PDF export - requires jsPDF library - Placeholder');
        // Implement or mock
    }

    private downloadBlob(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Node Interaction
    private attachNodeListeners(): void {
        const nodes = this.diagramRef.current?.querySelectorAll('.node, .edgeLabel');
        nodes?.forEach(node => {
            // cast to HTMLElement to access style/classList
            const elem = node as HTMLElement;
            elem.style.cursor = 'pointer';
            elem.addEventListener('click', (e) => {
                const nodeId = elem.getAttribute('id');
                if (this.onNodeClickCallback) {
                    this.onNodeClickCallback(nodeId || '', e as MouseEvent);
                }
            });
        });
    }

    // Getters
    get zoom(): number { return this._zoom; }
    get panX(): number { return this._panX; }
    get panY(): number { return this._panY; }
    get diagramType(): DiagramType | null { return this._diagramType; }
    get diagramTitle(): string | null {
        const titleMatch = this._diagramSource.match(/title\s+(.+)/);
        return titleMatch ? titleMatch[1] : null;
    }
    get theme(): MermaidTheme { return this._theme; }

    // Cleanup
    private cleanup(): void {
        this._renderedSVG = null;
    }
}

