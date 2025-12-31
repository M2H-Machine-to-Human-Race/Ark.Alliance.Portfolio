import React from 'react';
import { Button } from '../../../Button';
import { Icon } from '../../../Icon';

interface GridFooterProps {
    totalRows: number;
    filteredRows: number;
    selectedRows: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const GridFooter: React.FC<GridFooterProps> = ({
    totalRows,
    filteredRows,
    selectedRows,
    currentPage,
    totalPages,
    onPageChange
}) => {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500">
            <div className="flex items-center gap-4">
                <span>Total: {totalRows}</span>
                {filteredRows !== totalRows && <span>Filtered: {filteredRows}</span>}
                {selectedRows > 0 && <span className="text-blue-500 font-medium">Selected: {selectedRows}</span>}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <Icon name="chevron-left" size="sm" />
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <Icon name="chevron-right" size="sm" />
                </Button>
            </div>
        </div>
    );
};

