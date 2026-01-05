import { BaseComponentModel } from '../../base/BaseComponent.model';
import {
    GridColumn,
    GridRow,
    SortState,
    FilterState,
    FixedColumns
} from './DataGrid.types';
import React from 'react';

export class DataGridViewModel extends BaseComponentModel {
    // Core Data
    private _data: GridRow[] = [];
    public _filteredData: GridRow[] = [];
    private _columns: GridColumn[] = [];

    // View State
    public _sortState: SortState[] = [];
    public _filterState: FilterState = {};
    public _columnWidths: Map<string, number> = new Map();
    public _selectedRows: Set<string> = new Set();
    private _theme: string = 'default';

    // Virtual Scrolling
    private _scrollTop: number = 0;
    private _rowHeight: number = 48;
    public _visibleRowCount: number = 0;
    public _startIndex: number = 0;
    public _endIndex: number = 0;

    // Fixed Columns
    private _fixedColumns: FixedColumns;

    // UI State
    public _showFilterPanel: boolean = false;
    public _resizingColumn: string | null = null;

    // Refs
    public scrollContainerRef: React.RefObject<HTMLDivElement | null> = React.createRef();

    // Callbacks
    private updateCallback?: () => void;

    constructor(
        columns: GridColumn[],
        data: GridRow[],
        fixedColumns: FixedColumns,
        updateCallback?: () => void
    ) {
        super();
        this._columns = columns;
        this._data = data;
        this._filteredData = [...data];
        this._fixedColumns = fixedColumns;
        this.updateCallback = updateCallback;

        // Initialize column widths
        columns.forEach(col => {
            this._columnWidths.set(col.field, col.width || 150);
        });
    }

    public onInit(): void {
        this.calculateVisibleRows();
        this.applyFiltersAndSort();
    }

    public onDestroy(): void {
        this.cleanup();
    }

    // New methods to satisfy interface usage
    public setTheme(theme: string): void {
        this._theme = theme;
    }

    public exportToCSV(): void {
        console.log('Exporting CSV...');
    }

    private notifyUpdate() {
        if (this.updateCallback) this.updateCallback();
    }

    // Sorting
    public toggleSort(field: string): void {
        const existingSort = this._sortState.find(s => s.field === field);

        if (!existingSort) {
            this._sortState.push({ field, direction: 'asc' });
        } else if (existingSort.direction === 'asc') {
            existingSort.direction = 'desc';
        } else {
            this._sortState = this._sortState.filter(s => s.field !== field);
        }

        this.applyFiltersAndSort();
        this.notifyUpdate();
    }

    public getSortIcon(field: string): string {
        const sort = this._sortState.find(s => s.field === field);
        if (!sort) return '';
        return sort.direction === 'asc' ? '↑' : '↓';
    }

    private applySorting(data: GridRow[]): GridRow[] {
        if (this._sortState.length === 0) return data;

        return [...data].sort((a, b) => {
            for (const sort of this._sortState) {
                const aVal = a[sort.field];
                const bVal = b[sort.field];
                let comparison = 0;
                if (aVal < bVal) comparison = -1;
                if (aVal > bVal) comparison = 1;

                if (comparison !== 0) {
                    return sort.direction === 'asc' ? comparison : -comparison;
                }
            }
            return 0;
        });
    }

    // Filtering
    public setFilter(field: string, value: string): void {
        if (value.trim() === '') {
            delete this._filterState[field];
        } else {
            this._filterState[field] = value.toLowerCase();
        }

        this.applyFiltersAndSort();
        this.notifyUpdate();
    }

    public getFilterValue(field: string): string {
        return this._filterState[field] || '';
    }

    public clearAllFilters(): void {
        this._filterState = {};
        this.applyFiltersAndSort();
        this.notifyUpdate();
    }

    public toggleFilterPanel(): void {
        this._showFilterPanel = !this._showFilterPanel;
        this.notifyUpdate();
    }

    private applyFiltering(data: GridRow[]): GridRow[] {
        const filterFields = Object.keys(this._filterState);
        if (filterFields.length === 0) return data;

        return data.filter(row => {
            return filterFields.every(field => {
                const filterValue = this._filterState[field];
                const cellValue = String(row[field] || '').toLowerCase();
                return cellValue.includes(filterValue);
            });
        });
    }

    private applyFiltersAndSort(): void {
        let result = [...this._data];
        result = this.applyFiltering(result);
        result = this.applySorting(result);
        this._filteredData = result;

        this.calculateVisibleRows();
    }

    // Column Resizing
    public startResize(field: string, event: React.MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        this._resizingColumn = field;
        const startX = event.clientX;
        const startWidth = this._columnWidths.get(field) || 150;

        const handleMouseMove = (e: MouseEvent) => {
            const diff = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + diff);
            this._columnWidths.set(field, newWidth);
            this.notifyUpdate();
        };

        const handleMouseUp = () => {
            this._resizingColumn = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            this.notifyUpdate();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    public getColumnWidth(field: string): number {
        return this._columnWidths.get(field) || 150;
    }

    // Fixed Columns
    public getFixedColumnOffset(index: number, side: 'left' | 'right'): number {
        let offset = 0;
        if (side === 'left') {
            for (let i = 0; i < index; i++) {
                if (this._columns[i].fixed === 'left') {
                    offset += this.getColumnWidth(this._columns[i].field);
                }
            }
        } else {
            for (let i = index + 1; i < this._columns.length; i++) {
                if (this._columns[i].fixed === 'right') {
                    offset += this.getColumnWidth(this._columns[i].field);
                }
            }
        }
        return offset;
    }

    // Virtual Scrolling
    public handleScroll = (event: React.UIEvent<HTMLDivElement>): void => {
        this._scrollTop = event.currentTarget.scrollTop;
        this.calculateVisibleRows();
        this.notifyUpdate();
    };

    private calculateVisibleRows(): void {
        const containerHeight = this.scrollContainerRef.current?.clientHeight || 600;
        this._visibleRowCount = Math.ceil(containerHeight / this._rowHeight) + 4;
        this._startIndex = Math.floor(this._scrollTop / this._rowHeight);
        this._startIndex = Math.max(0, this._startIndex - 1);
        this._endIndex = Math.min(
            this._startIndex + this._visibleRowCount,
            this._filteredData.length
        );
    }

    public getRowOffset(index: number): number {
        return (this._startIndex + index) * this._rowHeight;
    }

    get visibleRows(): GridRow[] {
        return this._filteredData.slice(this._startIndex, this._endIndex);
    }

    get totalHeight(): number {
        return this._filteredData.length * this._rowHeight;
    }

    get rowHeight(): number {
        return this._rowHeight;
    }

    // Row Selection
    public toggleRowSelection(rowId: string): void {
        if (this._selectedRows.has(rowId)) {
            this._selectedRows.delete(rowId);
        } else {
            this._selectedRows.add(rowId);
        }
        this.notifyUpdate();
    }

    public isRowSelected(rowId: string): boolean {
        return this._selectedRows.has(rowId);
    }

    // Getters
    get data(): GridRow[] { return this._data; }
    get filteredData(): GridRow[] { return this._filteredData; }
    get visibleColumns(): GridColumn[] { return this._columns; }
    get sortState(): SortState[] { return this._sortState; }
    get filterState(): FilterState { return this._filterState; }
    get selectedRows(): Set<string> { return this._selectedRows; }
    get showFilterPanel(): boolean { return this._showFilterPanel; }
    get currentPage(): number { return 1; }
    get totalPages(): number { return 1; }
    public setPage(page: number): void { console.log('Page:', page); }

    private cleanup(): void {
        this._selectedRows.clear();
        this._columnWidths.clear();
    }
}

