import React, { useRef, useState, useEffect } from 'react';
import { TreeViewProps, TreeNodeData } from './TreeView.types';
import { TreeViewModel } from './TreeView.model';
import { TreeNode } from './TreeNode/TreeNode'; // Fixed Import Path
import { cn } from '../../../utils/cn';
import './TreeView.styles.css';

export const TreeView: React.FC<TreeViewProps> = ({
    data,
    multiSelect = false,
    className
}) => {
    const [, forceUpdate] = useState({});
    const vm = useRef(new TreeViewModel(data, () => forceUpdate({})));

    useEffect(() => {
        vm.current.onInit();
        return () => vm.current.onDestroy();
    }, []);

    // Recursive Helper to render nodes with correct state from VM
    const renderNodes = (nodes: TreeNodeData[], level: number) => {
        return nodes.map(node => (
            <React.Fragment key={node.id}>
                <div className="tree-node">
                    <div
                        className={cn(
                            "tree-node__content",
                            vm.current.isSelected(node.id) && "tree-node__content--selected"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            vm.current.selectNode(node.id, multiSelect || e.ctrlKey || e.metaKey);
                            if (node.children && node.children.length > 0) {
                                vm.current.toggleNode(node.id);
                            }
                        }}
                    >
                        <div
                            className={cn(
                                "tree-node__toggle",
                                vm.current.isExpanded(node.id) && "tree-node__toggle--expanded",
                                (!node.children || node.children.length === 0) && "invisible"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                vm.current.toggleNode(node.id);
                            }}
                        >
                            {/* Assuming generic Icon component is available from context or import, using text for now to avoid circular deps if broken */}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                        </div>

                        <div className="tree-node__icon">
                            {/* Placeholder for Icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={node.type === 'folder' ? "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" : "M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"} /></svg>
                        </div>
                        <span className="tree-node__label">{node.label}</span>
                    </div>

                    {node.children && node.children.length > 0 && vm.current.isExpanded(node.id) && (
                        <div className="tree-node__children">
                            {renderNodes(node.children, level + 1)}
                        </div>
                    )}
                </div>
            </React.Fragment>
        ));
    };

    return (
        <div className={cn("tree-view", className)}>
            {renderNodes(vm.current.getNodes(), 0)}
        </div>
    );
};

