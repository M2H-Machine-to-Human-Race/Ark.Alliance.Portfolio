import React from 'react';
import { SortState, FilterState } from '../../DataGrid.types';
import { Button } from '../../../Button'; // Assuming we have generic Button
import { Icon } from '../../../Icon';

interface GridHeaderProps {
    title?: string;
    icon?: React.ReactNode;
    sortState: SortState[];
    filterState: FilterState;
    onExport: () => void;
    onToggleFilter: () => void;
    onClearFilters: () => void;
}

export const GridHeader: React.FC<GridHeaderProps> = ({
    title,
    icon,
    sortState,
    filterState,
    onExport,
    onToggleFilter,
    onClearFilters
}) => {
    const activeFilterCount = Object.keys(filterState).length;

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
                {icon && <span className="text-slate-500">{icon}</span>}
                {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFilter}
                    className={activeFilterCount > 0 ? "text-blue-500" : ""}
                    leftIcon={activeFilterCount > 0 ? <Icon name="filter" size="sm" color="currentColor" /> : <Icon name="filter" size="sm" />}
                >
                    {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filter'}
                </Button>

                {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        Clear
                    </Button>
                )}

                <Button variant="outline" size="sm" onClick={onExport} leftIcon={<Icon name="download" size="sm" />}>
                    Export
                </Button>
            </div>
        </div>
    );
};

