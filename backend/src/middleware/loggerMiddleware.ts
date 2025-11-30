import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log the incoming request
    logger.info(`Incoming ${req.method} request to ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.method !== 'GET' ? req.body : undefined,
        query: req.query,
        params: req.params,
    });

    // Override res.end to log the response
    const originalEnd = res.end.bind(res);
    res.end = function (chunk?: any, encoding?: any, cb?: () => void) {
        const duration = Date.now() - start;

        logger.info(`Outgoing ${req.method} response from ${req.originalUrl}`, {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length'),
        });

        return originalEnd.call(this, chunk, encoding, cb);
    };

    next();
};

export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.body,
        query: req.query,
        params: req.params,
    });

    next(err);
};