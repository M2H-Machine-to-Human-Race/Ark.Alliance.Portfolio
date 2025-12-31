import React from 'react';

export interface GridColumn {
    field: string;
    header: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    fixed?: 'left' | 'right';
    resizable?: boolean;
    cellRenderer?: (value: any, row: GridRow) => React.ReactNode;
    valueFormatter?: (value: any) => string;
}

export interface GridRow {
    id?: string;
    [key: string]: any;
}

export interface SortState {
    field: string;
    direction: 'asc' | 'desc';
}

export interface FilterState {
    [field: string]: string;
}

export interface FixedColumns {
    left?: number;
    right?: number;
}

export interface DataGridProps {
    columns: GridColumn[];
    data: GridRow[];
    title?: string;
    icon?: React.ReactNode;
    theme?: 'light' | 'dark';
    enableSorting?: boolean;
    enableFiltering?: boolean;
    enableColumnResize?: boolean;
    enableRowSelection?: boolean;
    fixedColumns?: FixedColumns;
    height?: number;
    rowHeight?: number;
    onRowClick?: (row: GridRow) => void;
    onSelectionChange?: (selectedIds: string[]) => void;
}

export interface VirtualScrollState {
    scrollTop: number;
    visibleStartIndex: number;
    visibleEndIndex: number;
    totalHeight: number;
}

