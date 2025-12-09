import React from 'react';
import { cn } from '../../utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    currentItemsCount: number;
    onPageChange: (page: number) => void;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    currentItemsCount,
    onPageChange,
    hasPreviousPage,
    hasNextPage,
    className
}) => {
    if (totalPages <= 1) return null;

    const renderPageButtons = () => {
        const pages: React.ReactNode[] = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPreviousPage || currentPage === 1}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    hasPreviousPage && currentPage > 1
                        ? "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
                )}
            >
                Previous
            </button>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => onPageChange(1)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(
                    <span key="ellipsis1" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        i === currentPage
                            ? "bg-blue-600 text-white border border-blue-600"
                            : "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <span key="ellipsis2" className="px-2 text-gray-500">
                        ...
                    </span>
                );
            }
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                        "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage || currentPage === totalPages}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    hasNextPage && currentPage < totalPages
                        ? "bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
                )}
            >
                Next
            </button>
        );

        return <>{pages}</>;
    };

    return (
        <div className={cn("flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-800", className)}>
            <p className={cn('text-sm text-gray-500 dark:text-gray-400')}>
                Showing {currentItemsCount} of {totalItems} items
            </p>
            <div className={cn("flex justify-center items-center gap-2 flex-wrap")}>
                {renderPageButtons()}
            </div>
        </div>
    );
};

export default Pagination;