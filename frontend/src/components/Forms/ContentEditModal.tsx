import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { cn, handleApiError } from "../../utils";
import { Button, Input, Select, LoadingSpinner } from "../index";
import { useUpdateContentMutation } from "../../redux/api/contentApi";
import type { ContentResponse } from "../../redux/api/contentApi";
import { useGetTagsQuery } from "../../redux/api/tagsApi";

interface EditContentFormProps {
    content: ContentResponse;
    onCancel: () => void;
    onSuccess: () => void;
}

type EditFormData = {
    title: string;
    content: string;
    url: string;
    tagId: string;
};

const ContentEdit: React.FC<EditContentFormProps> = ({ content, onCancel, onSuccess }) => {
    const [editError, setEditError] = useState<string | null>(null);
    const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();
    const { data: tagsData, isLoading: tagsLoading } = useGetTagsQuery();

    const tags = tagsData?.data || [];

    const { register, handleSubmit, formState: { errors } } = useForm<EditFormData>({
        defaultValues: {
            title: content.title,
            content: content.content,
            url: content.url || "",
            tagId: tagsData?.data.find(tag => tag.name === content.tag)?.id.toString() || "",
        }
    });

    const handleEdit = async (data: EditFormData) => {
        setEditError(null);
        try {
            await updateContent({
                id: content.id,
                data: {
                    title: data.title,
                    content: data.content,
                    url: data.url,
                    tagId: Number(data.tagId),
                }
            }).unwrap();
            onSuccess();
        } catch (error: unknown) {
            const apiError = handleApiError(error, 'Failed to update content');
            setEditError(apiError.data.errors ? `${apiError.data.message}: ${apiError.data.errors}` : apiError.data.message);
        }
    };

    return (
        <div className={cn("bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 w-[500px] max-w-[90vw] p-6 max-h-[90vh] overflow-y-auto")}>
            <h2 className={cn("text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4")}>
                Update Content
            </h2>

            <form onSubmit={handleSubmit(handleEdit)} className="space-y-5">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            label="TITLE"
                            placeholder="e.g., React Hooks Guide"
                            variant="ContentCreateInput"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && (
                            <p className={cn("text-red-600 dark:text-red-400 text-xs ml-1")}>
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="CONTENT / DESCRIPTION"
                            placeholder="e.g., A comprehensive guide to hooks..."
                            variant="ContentCreateInput"
                            {...register('content', { required: 'Content is required' })}
                        />
                        {errors.content && (
                            <p className={cn("text-red-600 dark:text-red-400 text-xs ml-1")}>
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="URL"
                            placeholder="https://example.com"
                            variant="ContentCreateInput"
                            {...register('url', { required: 'URL is required' })}
                        />
                        {errors.url && (
                            <p className={cn("text-red-600 dark:text-red-400 text-xs ml-1")}>
                                {errors.url.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Select
                            label="TYPE"
                            options={tags}
                            variant="ContentCreateSelect"
                            {...register('tagId', { required: 'Tag is required' })}
                        />
                        {errors.tagId && (
                            <p className={cn("text-red-600 dark:text-red-400 text-xs ml-1")}>
                                {errors.tagId.message}
                            </p>
                        )}
                    </div>
                </div>

                {editError && (
                    <p className={cn("text-red-600 dark:text-red-400 text-sm")}>
                        {editError}
                    </p>
                )}

                <div className="pt-2 flex gap-3">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isUpdating}
                        className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="LoginButton"
                        disabled={isUpdating || tagsLoading}
                        className="flex-1"
                    >
                        {isUpdating ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner size="sm" />
                                Updating...
                            </span>
                        ) : 'Update Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ContentEdit;