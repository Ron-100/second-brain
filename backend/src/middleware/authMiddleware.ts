import { Request, Response, NextFunction } from "express";
import { JWTPayload, verifyToken } from "../lib/jwt";
import { apiError } from "../utils/apiError";
import logger from "../config/logger.config";

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
            uniqueId?: string;
        }
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            logger.warn('Authentication failed: No token provided', {
                method: req.method,
                url: req.originalUrl
            });
            throw new apiError("Access token required", 401);
        }

        const decoded = await verifyToken(token);
        req.user = decoded; // Attach user to request
        req.uniqueId = decoded.uniqueId; // Attach uniqueId to request

        logger.info('User authenticated successfully', {
            uniqueId: decoded.uniqueId,
            method: req.method,
            url: req.originalUrl
        });

        next();
    } catch (error) {
        logger.error((error as Error).message, {
            method: req.method,
            url: req.originalUrl
        });
        next(error);
    }
};

export default authenticateToken;