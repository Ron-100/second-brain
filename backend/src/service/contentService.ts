import { Request } from "express";
import { apiError } from "../utils/apiError";
import { repositoryWrapper } from "../repository/repositoryWrapper";
import logger from "../config/logger.config";
import { ContentRegisterRequest, ContentResponse, ContentResponseWithRange } from "../model/contentModel";

class ContentService {
    constructor(contentData: Request) {
        // this.userData = userData;
    }

    private async getCurrentUser(uniqueId: string) {
        // Find the user by uniqueId to get the internal ID
        const user = await repositoryWrapper.userRepository.findUser({ uniqueId });
        if (!user) {
            logger.warn('Content registration failed: User not found', { uniqueId });
            throw new apiError("User not found", 404);
        }
        return user;
    }

    async registerContent(req: Request & { uniqueId?: any }): Promise<ContentResponse> {
        const request: ContentRegisterRequest = req.body;
        // TODO check with the link id after create link serice.
        logger.info('Content registration attempt', { uniqueId: request.uniqueId, title: request.title, content: request.content, url: request.url, tagId: request.tagId, linkId: request.linkId });
        const user = await this.getCurrentUser(request.uniqueId);

        const isUniqueIdExist = await repositoryWrapper.contentRepository.findContent({ uniqueId: request.uniqueId });
        if (isUniqueIdExist) {
            logger.warn('Content Registration failed: Unique Id already exists', { uniqueId: request.uniqueId });
            throw new apiError("Unique Id already exists", 409);
        }

        const content = await repositoryWrapper.contentRepository.create({
            uniqueId: request.uniqueId,
            title: request.title,
            content: request.content,
            url: request.url,
            userId: user.id,
            tagId: request.tagId,
            linkId: request.linkId ?? null,
        })

        logger.info('Content registered successfully', { uniqueId: request.uniqueId, title: request.title, content: request.content, url: request.url, userId: user.id, tagId: request.tagId, linkId: request.linkId });

        const tag = await repositoryWrapper.tagRepository.findById(request.tagId!);
        const link = request.linkId ? await repositoryWrapper.linkRepository.findById(request.linkId!) : null;

        return {
            id: content.id,
            uniqueId: content.uniqueId!,
            title: content.title,
            content: content.content,
            url: content.url,
            userId: content.userId,
            tag: tag?.name || "Untagged",
            link: link?.hashedUrl
        }
    }

    async getContentById(req: Request & { uniqueId?: any }): Promise<ContentResponse> {
        // TODO check with the link id after create link serice.
        const contentId = Number(req.params.id);

        logger.info('Content retrieval attempt', { contentId });

        const user = await this.getCurrentUser(req.uniqueId);

        const content = await repositoryWrapper.contentRepository.findContent({ id: contentId, userId: user.id });
        if (!content) {
            logger.warn('Content retrieval failed: Content not found', { contentId });
            throw new apiError("Content not found", 404);
        }

        const tag = await repositoryWrapper.tagRepository.findById(content.tagId!);
        const link = content.linkId ? await repositoryWrapper.linkRepository.findById(content.linkId!) : null;

        logger.info('Content retrieved successfully', { contentId, uniqueId: content.uniqueId, title: content.title });

        return {
            id: content.id,
            uniqueId: content.uniqueId!,
            title: content.title,
            content: content.content,
            url: content.url,
            userId: content.userId,
            tag: tag?.name || "Untagged",
            link: link?.hashedUrl
        }
    }

    async getAllContentsByRangeAndTag(req: Request & { uniqueId?: any }): Promise<ContentResponseWithRange> {
        const tagId = Number(req.query.tagId);
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        logger.info('Get all contents attempt', { tagId, page, limit });

        const user = await this.getCurrentUser(req.uniqueId);

        logger.info('Contents retrieved successfully', { tagId: tagId, start: page, end: limit });

        let TotalLinks: number;
        if (tagId > 0) {
            TotalLinks = await repositoryWrapper.contentRepository.getTotalLinksCountByTagIdAndByUser(user.id, tagId);
        } else {
            TotalLinks = await repositoryWrapper.contentRepository.getTotalLinksCountByUser(user.id);
        }

        // Calculate offset
        const skip = (page - 1) * limit;

        // Get contents
        const contents = await repositoryWrapper.contentRepository.getContentWithPagination(
            user.id,
            tagId,
            skip,
            limit
        );

        // map contents to ContentResponse format
        const contentResponses: ContentResponse[] = await Promise.all(
            contents.map(async (content) => {
                const tag = await repositoryWrapper.tagRepository.findById(content.tagId!);
                const link = content.linkId ? await repositoryWrapper.linkRepository.findById(content.linkId!) : null;

                return {
                    id: content.id,
                    uniqueId: content.uniqueId!,
                    title: content.title,
                    content: content.content,
                    url: content.url,
                    userId: content.userId,
                    tag: tag?.name || "Untagged",
                    link: link?.hashedUrl
                };
            })
        );

        const totalPages = Math.ceil(TotalLinks / limit);

        logger.info('Contents retrieved successfully', { tagId: tagId, page: page, limit: limit, totalLinks: TotalLinks, returnedCount: contentResponses.length });

        return {
            totalLinks: TotalLinks,
            currentPage: page,
            totalPages: totalPages,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            contents: contentResponses
        };
    }

    async deleteContent(req: Request & { uniqueId?: any }): Promise<{ message: string }> {
        const contentId = Number(req.params.id);

        logger.info('Content deletion attempt', { contentId });

        const user = await this.getCurrentUser(req.uniqueId);

        const content = await repositoryWrapper.contentRepository.findContent({ id: contentId, userId: user.id });
        if (!content) {
            logger.warn('Content deletion failed: Content not available', { contentId });
            throw new apiError("Content not available", 404);
        }

        const response = await repositoryWrapper.contentRepository.deleteContent(contentId, user.id);

        if (!response) {
            logger.warn('Content deletion failed: Content not found or not owned by user', { contentId, userId: user.id });
            throw new apiError("Content not found or access denied", 404);
        }

        logger.info('Content deleted successfully', { contentId, userId: user.id });

        return {
            message: "Content deleted successfully"
        };
    }

    async updateContent(req: Request & { uniqueId?: any }): Promise<ContentResponse> {
        const contentId = Number(req.params.id);
        const newContent = req.body;

        const user = await this.getCurrentUser(req.uniqueId);

        logger.info('Content update attempt', { contentId, userId: user.id });

        const content = await repositoryWrapper.contentRepository.findContent({ id: contentId, userId: user.id });
        if (!content) {
            logger.warn('Content update failed: Content not found', { contentId });
            throw new apiError("Content not found", 404);
        }

        // Update the content with new data
        const updatedContent = await repositoryWrapper.contentRepository.update(contentId, {
            title: newContent.title || content.title,
            content: newContent.content || content.content,
            url: newContent.url || content.url,
            tagId: newContent.tagId || content.tagId,
            linkId: newContent.linkId !== undefined ? newContent.linkId : content.linkId,
        });

        logger.info('Content updated successfully', { contentId, userId: user.id });

        const tag = await repositoryWrapper.tagRepository.findById(updatedContent.tagId!);
        const link = updatedContent.linkId ? await repositoryWrapper.linkRepository.findById(updatedContent.linkId!) : null;

        return {
            id: updatedContent.id,
            uniqueId: updatedContent.uniqueId!,
            title: updatedContent.title,
            content: updatedContent.content,
            url: updatedContent.url,
            userId: updatedContent.userId,
            tag: tag?.name || "Untagged",
            link: link?.hashedUrl
        };

    }

}

export default ContentService;