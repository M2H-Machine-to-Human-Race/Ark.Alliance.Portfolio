import React from 'react';
import { GridColumn, GridRow } from '../../DataGrid.types';

interface GridCellProps {
    value: any;
    column: GridColumn;
    rowData: GridRow;
    isFixed?: 'left' | 'right';
    width: number;
    offset?: number;
}

export const GridCell: React.FC<GridCellProps> = ({
    value,
    column,
    rowData,
    isFixed,
    width,
    offset
}) => {
    // Render content
    let content: React.ReactNode = value;

    if (column.valueFormatter) {
        content = column.valueFormatter(value);
    }

    if (column.cellRenderer) {
        content = column.cellRenderer(value, rowData);
    }

    const style: React.CSSProperties = {
        width: width,
        minWidth: width, // Ensure flex doesn't shrink it
    };

    if (isFixed === 'left' && offset !== undefined) {
        style.left = offset;
    }
    if (isFixed === 'right' && offset !== undefined) {
        style.right = offset;
    }

    return (
        <div
            className={`data-grid__cell ${isFixed ? `data-grid__cell--fixed-${isFixed}` : ''}`}
            style={style}
            title={typeof content === 'string' ? content : undefined}
        >
            {content}
        </div>
    );
};

