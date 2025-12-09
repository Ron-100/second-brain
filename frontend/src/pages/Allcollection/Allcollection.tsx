import React, { useState } from "react";
import { cn } from "../../utils";
import { ContentCard, LoadingSpinner } from "../../components";
import { useGetAllContentsQuery } from "../../redux/api/contentApi";
import Pagination from "../../components/ui/Pagination"; // Make sure to export this

const Allcollection: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const { data, isLoading, error } = useGetAllContentsQuery({
        page: currentPage,
        limit: itemsPerPage,
        tagId: 0,
    });

    const contentData = data?.data;
    const contents = contentData?.contents || [];
    const totalPages = contentData?.totalPages || 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={cn('m-auto max-w-[1536px] w-full min-h-screen h-full px-4 py-8')}>
            <div className="mb-8">
                <h1 className={cn('text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2')}>
                    All Collection
                </h1>
            </div>

            {isLoading ? (
                <div className={cn("flex justify-center items-center min-h-[400px]")}>
                    <LoadingSpinner size="lg" />
                </div>
            ) : error ? (
                <div className={cn("flex justify-center items-center min-h-[400px]")}>
                    <p className={cn("text-red-600 dark:text-red-400")}>
                        Failed to load content. Please try again later.
                    </p>
                </div>
            ) : contents.length === 0 ? (
                <div className={cn("flex justify-center items-center min-h-[400px]")}>
                    <p className={cn("text-gray-500 dark:text-gray-400")}>
                        No content found.
                    </p>
                </div>
            ) : (
                <>
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8")}>
                        {contents.map((content) => (
                            <ContentCard key={content.id} content={content} />
                        ))}
                    </div>

                    {contentData && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={contentData.totalLinks}
                            itemsPerPage={itemsPerPage}
                            currentItemsCount={contents.length}
                            onPageChange={handlePageChange}
                            hasPreviousPage={contentData.hasPreviousPage}
                            hasNextPage={contentData.hasNextPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Allcollection;