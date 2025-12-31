import React from 'react';
import { useDataGridViewModel } from './DataGrid.hooks';
import { DataGridProps } from './DataGrid.types';
import { GridHeader } from './components/GridHeader/GridHeader';
import { GridFooter } from './components/GridFooter/GridFooter';
import { GridCell } from './components/GridCell/GridCell';
import './DataGrid.styles.css';

export const DataGrid: React.FC<DataGridProps> = ({
    columns,
    data,
    title,
    icon,
    theme = 'light',
    enableSorting = true,
    enableFiltering = true,
    enableColumnResize = true,
    enableRowSelection = false,
    fixedColumns = { left: 0, right: 0 },
    height = 600,
    onRowClick,
    onSelectionChange
}) => {
    const vm = useDataGridViewModel({
        columns,
        data,
        theme,
        fixedColumns, // Pass through props to hook
        enableSorting,
        enableFiltering,
        enableColumnResize,
        enableRowSelection,
        height,
        title,
        icon,
        onRowClick,
        onSelectionChange
    });

    return (
        <div className={`data-grid data-grid--${theme}`}>
            {/* Header */}
            <GridHeader
                title={title}
                icon={icon}
                sortState={vm.sortState}
                filterState={vm.filterState}
                onExport={vm.exportToCSV}
                onToggleFilter={vm.toggleFilterPanel}
                onClearFilters={vm.clearAllFilters}
            />

            {/* Filter Panel (collapsible) */}
            {vm.showFilterPanel && (
                <div className="data-grid__filter-panel">
                    {vm.visibleColumns.map(col => (
                        <div key={col.field} className="data-grid__filter-item">
                            <label>{col.header}</label>
                            <input
                                type="text"
                                placeholder={`Filter ${col.header}...`}
                                value={vm.getFilterValue(col.field)}
                                onChange={(e) => vm.setFilter(col.field, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Grid Container */}
            <div
                className="data-grid__container"
                style={{ height }}
            >
                {/* Column Headers */}
                <div className="data-grid__header-row">
                    {vm.visibleColumns.map((column, index) => (
                        <div
                            key={column.field}
                            className={`
                data-grid__header-cell
                ${column.fixed ? `data-grid__header-cell--fixed-${column.fixed}` : ''}
                ${vm.getSortIcon(column.field) ? 'data-grid__header-cell--sorted' : ''}
              `}
                            style={{
                                width: vm.getColumnWidth(column.field),
                                minWidth: vm.getColumnWidth(column.field),
                                left: column.fixed === 'left' ? vm.getFixedColumnOffset(index, 'left') : undefined,
                                right: column.fixed === 'right' ? vm.getFixedColumnOffset(index, 'right') : undefined
                            }}
                            onClick={() => enableSorting && vm.toggleSort(column.field)}
                        >
                            <span className="data-grid__header-content" title={column.header}>
                                {column.header}
                                {vm.getSortIcon(column.field) && <span className="text-xs ml-1">{vm.getSortIcon(column.field)}</span>}
                            </span>

                            {enableColumnResize && (
                                <div
                                    className="data-grid__column-resizer"
                                    onMouseDown={(e) => vm.startResize(column.field, e)}
                                    onClick={(e) => e.stopPropagation()} // Prevent sort on resize click
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Virtual Scrolling Container */}
                <div
                    ref={vm.scrollContainerRef}
                    className="data-grid__body"
                    onScroll={vm.handleScroll}
                >
                    <div
                        className="data-grid__virtual-spacer"
                        style={{ height: vm.totalHeight }}
                    >
                        {/* Visible Rows Only (Virtual Scrolling) */}
                        {vm.visibleRows.map((row, rowIndex) => (
                            <div
                                key={row.id || `row-${rowIndex}`}
                                className={`
                  data-grid__row
                  ${row.id && vm.isRowSelected(row.id) ? 'data-grid__row--selected' : ''}
                `}
                                style={{
                                    transform: `translateY(${vm.getRowOffset(rowIndex)}px)`,
                                    height: vm.rowHeight
                                }}
                                onClick={() => onRowClick?.(row)}
                            >
                                {vm.visibleColumns.map((column, colIndex) => (
                                    <GridCell
                                        key={`${row.id || rowIndex}-${column.field}`}
                                        value={row[column.field]}
                                        column={column}
                                        rowData={row}
                                        isFixed={column.fixed}
                                        width={vm.getColumnWidth(column.field)}
                                        offset={
                                            column.fixed === 'left'
                                                ? vm.getFixedColumnOffset(colIndex, 'left')
                                                : column.fixed === 'right'
                                                    ? vm.getFixedColumnOffset(colIndex, 'right')
                                                    : undefined
                                        }
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loading Overlay */}
                {vm.isLoading && (
                    <div className="data-grid__loading-overlay">
                        <div className="data-grid__spinner" />
                        <span>Loading data...</span>
                    </div>
                )}

                {/* Empty State */}
                {!vm.isLoading && vm.filteredData.length === 0 && (
                    <div className="data-grid__empty-state">
                        <span>No data to display</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <GridFooter
                totalRows={vm.data.length}
                filteredRows={vm.filteredData.length}
                selectedRows={vm.selectedRows.size}
                currentPage={vm.currentPage}
                totalPages={vm.totalPages}
                onPageChange={vm.setPage}
            />
        </div>
    );
};

