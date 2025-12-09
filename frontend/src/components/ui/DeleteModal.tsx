import React, { useState } from "react";
import { cn, handleApiError } from "../../utils";
import { Button, LoadingSpinner } from "../index";
import { useDeleteContentMutation } from "../../redux/api/contentApi";

interface DeleteModalProps {
    contentId: number;
    onCancel: () => void;
    onSuccess?: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ contentId, onCancel, onSuccess }) => {
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteContent, { isLoading: isDeleting }] = useDeleteContentMutation();

    const handleDelete = async () => {
        setDeleteError(null);
        try {
            await deleteContent(contentId).unwrap();
            if (onSuccess) onSuccess();
        } catch (error: unknown) {
            const apiError = handleApiError(error, 'Failed to delete content');
            setDeleteError(apiError.data.errors ? `${apiError.data.message}: ${apiError.data.errors}` : apiError.data.message);
        }
    };

    return (
        <div className={cn("bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-[400px] max-w-[90vw] p-6")}>
            <h2 className={cn("text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4")}>
                Delete Content
            </h2>
            <p className={cn("text-gray-600 dark:text-gray-400 mb-6")}>
                Are you sure you want to delete this content? This action cannot be undone.
            </p>

            {deleteError && (
                <p className={cn("text-red-600 dark:text-red-400 text-sm mb-4")}>
                    {deleteError}
                </p>
            )}

            <div className="flex gap-3 justify-end">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                    No
                </Button>
                <Button
                    variant="delete"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 text-white border-none"
                >
                    {isDeleting ? (
                        <span className="flex items-center gap-2">
                            <LoadingSpinner size="sm" />
                            Deleting...
                        </span>
                    ) : "Yes"}
                </Button>
            </div>
        </div>
    );
};

export default DeleteModal;