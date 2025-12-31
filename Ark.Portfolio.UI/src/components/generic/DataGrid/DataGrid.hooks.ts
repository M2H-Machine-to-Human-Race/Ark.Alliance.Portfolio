import { useState, useEffect, useMemo, useRef } from 'react';
import { DataGridViewModel } from './DataGrid.model';
import { DataGridProps } from './DataGrid.types';

export const useDataGridViewModel = (props: DataGridProps) => {
    // Force update hack for strict MVVM where VM holds state
    const [, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    const viewModel = useMemo(() => {
        return new DataGridViewModel(
            props.columns,
            props.data,
            props.fixedColumns || {},
            forceUpdate // Pass callback
        );
    }, [props.columns, props.data]); // Re-create if columns/data structure changes

    useEffect(() => {
        viewModel.onInit();
        if (props.theme) viewModel.setTheme(props.theme);
        return () => viewModel.onDestroy();
    }, [viewModel, props.theme]);

    // Expose Hooks-friendly API
    return {
        viewModel,
        // State proxies
        data: viewModel.data,
        filteredData: viewModel.filteredData,
        visibleColumns: viewModel.visibleColumns,
        sortState: viewModel.sortState,
        filterState: viewModel.filterState,
        selectedRows: viewModel.selectedRows,
        showFilterPanel: viewModel.showFilterPanel,
        isLoading: viewModel.isLoading,

        // Virtual Scroll Props
        scrollContainerRef: viewModel.scrollContainerRef,
        visibleRows: viewModel.visibleRows,
        totalHeight: viewModel.totalHeight,
        rowHeight: viewModel.rowHeight,
        getRowOffset: (i: number) => viewModel.getRowOffset(i),

        // Handlers
        handleScroll: viewModel.handleScroll,
        toggleSort: (field: string) => viewModel.toggleSort(field),
        getSortIcon: (field: string) => viewModel.getSortIcon(field),
        setFilter: (field: string, value: string) => viewModel.setFilter(field, value),
        getFilterValue: (field: string) => viewModel.getFilterValue(field),
        clearAllFilters: () => viewModel.clearAllFilters(),
        toggleFilterPanel: () => viewModel.toggleFilterPanel(),
        exportToCSV: () => viewModel.exportToCSV(),

        // Resizing
        startResize: (field: string, e: React.MouseEvent) => viewModel.startResize(field, e),
        getColumnWidth: (field: string) => viewModel.getColumnWidth(field),
        getFixedColumnOffset: (i: number, side: 'left' | 'right') => viewModel.getFixedColumnOffset(i, side),

        // Rows
        isRowSelected: (id: string) => viewModel.isRowSelected(id),
        toggleRowSelection: (id: string) => viewModel.toggleRowSelection(id),

        // Pagination
        currentPage: viewModel.currentPage,
        totalPages: viewModel.totalPages,
        setPage: (p: number) => viewModel.setPage(p)
    };
};

