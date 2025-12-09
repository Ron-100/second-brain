import React, { useState } from "react";
import { cn } from "../../utils";
import { Modal, ContentEdit, DeleteModal } from "../index";
import { MdDelete, MdEdit, MdLink } from "../icons";
import { HiExternalLink } from "../icons";
import type { ContentResponse } from "../../redux/api/contentApi";

interface ContentCardProps {
    content: ContentResponse;
};

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const hasLink = content.link !== null && content.link !== undefined;

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const handleOpenUrl = () => {
        if (content.url) {
            window.open(content.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <>
            <div className={cn("relative bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-shadow duration-300")}>
                {/* Top Icons */}
                <div className="absolute top-4 left-4 flex gap-3">
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className={cn("p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors")}
                        aria-label="Delete content"
                    >
                        <MdDelete className="text-red-600 dark:text-red-400 text-xl" />
                    </button>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className={cn("p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors")}
                        aria-label="Edit content"
                    >
                        <MdEdit className="text-blue-600 dark:text-blue-400 text-xl" />
                    </button>
                </div>

                <div className="absolute top-4 right-4">
                    <button
                        className={cn("p-2 rounded-lg transition-colors")}
                        aria-label="Shareable link"
                        disabled
                    >
                        <MdLink className={cn(
                            "text-xl",
                            hasLink ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-600"
                        )} />
                    </button>
                </div>

                {/* Content */}
                <div className="mt-8 space-y-4">
                    <div>
                        <h3 className={cn("text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2")}>
                            {truncateText(content.title, 60)}
                        </h3>
                        <p className={cn("text-sm text-gray-500 dark:text-gray-400 line-clamp-3")}>
                            {truncateText(content.content, 150)}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className={cn("text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300")}>
                            {content.tag}
                        </span>
                        <button
                            onClick={handleOpenUrl}
                            disabled={!content.url}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                content.url
                                    ? "bg-black hover:bg-blue-700 text-white"
                                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            )}
                        >
                            <span>Open Link</span>
                            <HiExternalLink className="text-base" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSubmit={() => { }}
            >
                <DeleteModal
                    contentId={content.id}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    onSuccess={() => setIsDeleteModalOpen(false)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={() => { }}
            >
                <ContentEdit
                    content={content}
                    onCancel={() => setIsEditModalOpen(false)}
                    onSuccess={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default ContentCard;