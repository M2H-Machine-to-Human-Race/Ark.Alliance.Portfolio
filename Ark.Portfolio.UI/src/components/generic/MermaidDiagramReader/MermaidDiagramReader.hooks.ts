import { useState, useEffect, useRef, useMemo } from 'react';
import { MermaidDiagramReaderViewModel } from './MermaidDiagramReader.model';
import { MermaidDiagramReaderProps } from './MermaidDiagramReader.types';

export const useMermaidDiagramViewModel = (props: MermaidDiagramReaderProps) => {
    const [renderCount, setRenderCount] = useState(0);
    const forceUpdate = () => setRenderCount(prev => prev + 1);

    const viewModel = useMemo(() => {
        const vm = new MermaidDiagramReaderViewModel(props.diagramSource, props.theme || 'light');
        if (props.onNodeClick) {
            vm.onNodeClickCallback = props.onNodeClick;
        }
        return vm;
    }, [props.diagramSource, props.theme]); // Re-create VM if source/theme changes drastically

    // Bind VM updates to React state
    useEffect(() => {
        // Hook into VM somehow or just rely on manual forceUpdates from interaction handlers in VM
        // For this strict MVVM pattern, we usually wrap VM methods to trigger update
        // But here we'll just expose the VM and let the component drive updates via event handlers that call forceUpdate
        // A better approach in strict MVVM is Vm emitting events.
        // For now, let's assume we re-render on interactions.

        // We can also proxy the VM to forceUpdate on property sets if we want reactivity
        // But keeping it simple:

        // Initialize
        const init = async () => {
            await viewModel.onInit();
            forceUpdate();
        };
        init();

        return () => {
            viewModel.onDestroy();
        };
    }, [viewModel]);

    // Wrap methods to force update UI
    const zoomIn = () => { viewModel.zoomIn(); forceUpdate(); };
    const zoomOut = () => { viewModel.zoomOut(); forceUpdate(); };
    const fitToScreen = () => { viewModel.fitToScreen(); forceUpdate(); };
    const toggleTheme = () => { viewModel.toggleTheme(); forceUpdate(); };
    const toggleFullscreen = () => { viewModel.toggleFullscreen(); forceUpdate(); };
    const handleWheel = (e: React.WheelEvent) => { viewModel.handleWheel(e); forceUpdate(); };
    const handleMouseDown = (e: React.MouseEvent) => {
        viewModel.handleMouseDown(e);
        // Mouse move updates need to trigger renders too, 
        // but the event listener is on document. 
        // We might need a loop or React state for panX/Y if we want smooth 60fps
        // For now relying on the standard MVVM flow.
        const interval = setInterval(() => forceUpdate(), 16); // Dirty 60fps shim for drag
        const cleanup = () => clearInterval(interval);
        document.addEventListener('mouseup', cleanup, { once: true });
    };

    return {
        viewModel,
        // Expose reactive state directly for easy binding
        zoom: viewModel.zoom,
        panX: viewModel.panX,
        panY: viewModel.panY,
        isLoading: viewModel.isLoading,
        error: viewModel.error,
        diagramType: viewModel.diagramType,
        diagramTitle: viewModel.diagramTitle,
        containerRef: viewModel.containerRef,
        diagramRef: viewModel.diagramRef,

        // Actions
        zoomIn,
        zoomOut,
        fitToScreen,
        toggleTheme,
        toggleFullscreen,
        exportAsPNG: () => viewModel.exportAsPNG(),
        exportAsSVG: () => viewModel.exportAsSVG(),
        exportAsPDF: () => viewModel.exportAsPDF(),
        handleWheel,
        handleMouseDown
    };
};

