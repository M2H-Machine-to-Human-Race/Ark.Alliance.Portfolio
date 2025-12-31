import React, { MouseEvent } from 'react';
import { TreeNodeData, NodeType } from '../TreeView.types';
import { Icon, IconSize } from '../../Icon';
import { cn } from '../../../../utils/cn';
{/* Styles imported in parent TreeView or globally */ }

interface TreeNodeProps {
    node: TreeNodeData;
    level: number;
    isExpanded: boolean;
    isSelected: boolean;
    onToggle: (nodeId: string) => void;
    onSelect: (nodeId: string, multiSelect: boolean) => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
    node,
    level,
    isExpanded,
    isSelected,
    onToggle,
    onSelect
}) => {
    const hasChildren = node.children && node.children.length > 0;

    const handleToggle = (e: MouseEvent) => {
        e.stopPropagation();
        onToggle(node.id);
    };

    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        onSelect(node.id, e.ctrlKey || e.metaKey);
        // If it's a folder, also toggle it on click (optional UX choice)
        if (node.type === NodeType.FOLDER) {
            onToggle(node.id);
        }
    };

    return (
        <div className="tree-node">
            <div
                className={cn(
                    "tree-node__content",
                    isSelected && "tree-node__content--selected"
                )}
                onClick={handleClick}
            >
                <div
                    className={cn(
                        "tree-node__toggle",
                        isExpanded && "tree-node__toggle--expanded",
                        !hasChildren && "invisible"
                    )}
                    onClick={handleToggle}
                >
                    <Icon name="chevron-right" size="xs" />
                </div>

                <div className="tree-node__icon">
                    <Icon name={node.icon || (node.type === NodeType.FOLDER ? 'folder' : 'file')} size="sm" />
                </div>

                <span className="tree-node__label">{node.label}</span>
            </div>

            {hasChildren && isExpanded && (
                <div className="tree-node__children">
                    {node.children!.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            isExpanded={false} // This state logic needs to be lifted to Parent/VM, passed down
                            isSelected={false} // This too
                            onToggle={onToggle}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

