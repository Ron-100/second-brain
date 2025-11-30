import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { apiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { ZodError } from "zod";
import logger from "../config/logger.config";

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    // Log the error
    logger.error('Error handled by middleware:', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode || 500,
    });

    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errors = null;

    if (err instanceof apiError) {
        statusCode = err.statusCode;
        errorMessage = err.message;
        errors = err.errors || null;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        errorMessage = "Validation failed";
        errors = err.errors[0].message;
    } else {
        statusCode = 500;
        errorMessage = "Internal Server Error";
        errors = err.message || "Something went wrong";
    }

    // Use ApiResponse format for consistent error responses
    const errorResponse = new ApiResponse(
        statusCode,
        {
            message: errorMessage,
            errors: errors
        },
        "null"
    );

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;