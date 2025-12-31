import { BaseComponentModel } from '../../base/BaseComponent.model';
import { TreeNodeData, ITreeViewModel } from './TreeView.types';

export class TreeViewModel extends BaseComponentModel implements ITreeViewModel {
    private _data: TreeNodeData[];
    private _expandedNodes: Set<string>;
    private _selectedNodes: Set<string>;
    private readonly onUpdate: () => void;

    constructor(initialData: TreeNodeData[], onUpdate: () => void) {
        super();
        this._data = initialData;
        this.onUpdate = onUpdate;
        this._expandedNodes = new Set();
        this._selectedNodes = new Set();
        this.initializeState(initialData);
    }

    private initializeState(nodes: TreeNodeData[]) {
        nodes.forEach(node => {
            if (node.isExpanded) this._expandedNodes.add(node.id);
            if (node.isSelected) this._selectedNodes.add(node.id);
            if (node.children) this.initializeState(node.children);
        });
    }

    onInit(): void { }
    onDestroy(): void { }

    public toggleNode(nodeId: string): void {
        if (this._expandedNodes.has(nodeId)) {
            this._expandedNodes.delete(nodeId);
        } else {
            this._expandedNodes.add(nodeId);
        }
        this.onUpdate();
    }

    public selectNode(nodeId: string, multiSelect: boolean): void {
        if (!multiSelect) {
            this._selectedNodes.clear();
            this._selectedNodes.add(nodeId);
        } else {
            if (this._selectedNodes.has(nodeId)) {
                this._selectedNodes.delete(nodeId);
            } else {
                this._selectedNodes.add(nodeId);
            }
        }
        this.onUpdate();
    }

    public isExpanded(nodeId: string): boolean {
        return this._expandedNodes.has(nodeId);
    }

    public isSelected(nodeId: string): boolean {
        return this._selectedNodes.has(nodeId);
    }

    public getNodes(): TreeNodeData[] {
        return this._data;
    }
}

