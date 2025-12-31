import { ReactNode } from 'react';

export enum NodeType {
    FOLDER = 'folder',
    FILE = 'file',
    ROOT = 'root'
}

export interface TreeNodeData {
    id: string;
    label: string;
    type: NodeType;
    icon?: string; // Name of icon in IconRegistry
    children?: TreeNodeData[];
    metadata?: Record<string, any>;
    isExpanded?: boolean;
    isSelected?: boolean;
    isDisabled?: boolean;
    parentId?: string | null;
}

export interface TreeViewProps {
    data: TreeNodeData[];
    onNodeClick?: (node: TreeNodeData) => void;
    onNodeExpand?: (node: TreeNodeData) => void;
    onNodeCollapse?: (node: TreeNodeData) => void;
    onNodeSelect?: (nodes: TreeNodeData[]) => void;
    multiSelect?: boolean;
    searchQuery?: string;
    showCheckboxes?: boolean;
    lazyLoad?: (node: TreeNodeData) => Promise<TreeNodeData[]>;
    renderCustomNode?: (node: TreeNodeData) => ReactNode;
    className?: string;
}

export interface ITreeViewModel {
    toggleNode(nodeId: string): void;
    selectNode(nodeId: string, multiSelect: boolean): void;
    isExpanded(nodeId: string): boolean;
    isSelected(nodeId: string): boolean;
    getNodes(): TreeNodeData[]; // Initial + Filtered
}

