import React from 'react';
import { useMermaidDiagramViewModel } from './MermaidDiagramReader.hooks';
import { MermaidDiagramReaderProps } from './MermaidDiagramReader.types';
import './MermaidDiagramReader.styles.css';

export const MermaidDiagramReader: React.FC<MermaidDiagramReaderProps> = ({
    diagramSource,
    theme = 'light',
    enableZoom = true,
    enablePan = true,
    enableExport = true,
    enableFullscreen = true,
    onNodeClick,
    onError
}) => {
    const {
        zoom,
        panX,
        panY,
        isLoading,
        error,
        diagramType,
        diagramTitle,
        containerRef,
        diagramRef,
        zoomIn,
        zoomOut,
        fitToScreen,
        toggleTheme,
        toggleFullscreen,
        exportAsPNG,
        exportAsSVG,
        exportAsPDF,
        handleWheel,
        handleMouseDown
    } = useMermaidDiagramViewModel({
        diagramSource,
        theme,
        onNodeClick,
        onError
    });

    return (
        <div className={`mermaid-reader mermaid-reader--${theme}`}>
            {/* Toolbar */}
            <div className="mermaid-reader__toolbar">
                <div className="mermaid-reader__toolbar-left">
                    <span className="mermaid-reader__title">
                        {diagramTitle || 'Diagram'}
                    </span>
                </div>

                <div className="mermaid-reader__toolbar-right">
                    {enableZoom && (
                        <>
                            <button onClick={zoomIn} title="Zoom In">+</button>
                            <button onClick={zoomOut} title="Zoom Out">-</button>
                            <button onClick={fitToScreen} title="Fit to Screen">Fit</button>
                        </>
                    )}

                    {enableExport && (
                        <div className="mermaid-reader__export-dropdown">
                            <button>Export ▼</button>
                            <div className="mermaid-reader__export-menu">
                                <button onClick={exportAsPNG}>PNG</button>
                                <button onClick={exportAsSVG}>SVG</button>
                                <button onClick={exportAsPDF}>PDF</button>
                            </div>
                        </div>
                    )}

                    {enableFullscreen && (
                        <button onClick={toggleFullscreen} title="Toggle Fullscreen">⛶</button>
                    )}

                    <button onClick={toggleTheme} title="Toggle Theme">🌓</button>
                </div>
            </div>

            {/* Diagram Container */}
            <div
                ref={containerRef}
                className="mermaid-reader__container"
                onWheel={enableZoom ? handleWheel : undefined}
                onMouseDown={enablePan ? handleMouseDown : undefined}
            >
                {isLoading && (
                    <div className="mermaid-reader__loader">Loading diagram...</div>
                )}

                {error && (
                    <div className="mermaid-reader__error">
                        <span>⚠ Error rendering diagram</span>
                        <pre>{error}</pre>
                    </div>
                )}

                <div
                    ref={diagramRef}
                    className="mermaid-reader__diagram"
                    style={{
                        transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`
                    }}
                />
            </div>

            {/* Footer */}
            <div className="mermaid-reader__footer">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
                <span>Type: {diagramType || 'Unknown'}</span>
            </div>
        </div>
    );
};

