import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, LoadingSpinner, Select } from "../index";
import { cn } from "../../utils";

interface ContentCreateProps {
    onSuccess?: () => void;
}

type FormData = {
    title: string;
    content: string;
    url: string;
    tag: string;
};

const ContentCreate: React.FC<ContentCreateProps> = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const typeOptions = [
        { value: "video", label: "Video" },
        { value: "post", label: "Article / Post" },
        { value: "links", label: "Link" },
        { value: "doc", label: "Document" },
    ];

    const onSubmit = async (data: FormData) => {
        // need to connect with api call. TODO
        console.log(data);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        reset();
    };

    return (
        <div className={cn('w-[350px] sm:w-[400px] bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col')}>

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Add New Content</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Save your favorite links and ideas.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

                <div className="space-y-4">
                    <div className="space-y-1">
                        <Input
                            label="TITLE"
                            placeholder="e.g., React Hooks Guide"
                            variant="ContentCreateInput"
                            {...register('title', { required: 'Title is required' })}
                        />
                        {errors.title && <p className="text-xs text-red-500 ml-1">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="CONTENT / DESCRIPTION"
                            placeholder="e.g., A comprehensive guide to hooks..."
                            variant="ContentCreateInput"
                            {...register('content', { required: 'Content is required' })}
                        />
                        {errors.content && <p className="text-xs text-red-500 ml-1">{errors.content.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <Input
                            label="URL"
                            placeholder="https://example.com"
                            variant="ContentCreateInput"
                            {...register('url', { required: 'URL is required' })}
                        />
                        {errors.url && <p className="text-xs text-red-500 ml-1">{errors.url.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <Select
                                label="TYPE"
                                options={typeOptions}
                                variant="ContentCreateSelect"
                                {...register('tag')}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        variant="LoginButton"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner size="sm" />
                                Adding...
                            </span>
                        ) : 'Create Content'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ContentCreate;