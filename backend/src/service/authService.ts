import { Request } from "express";
import { createToken, verifyToken } from "../lib/jwt";
import { apiError } from "../utils/apiError";
import { UserLoginResponse, UserRegisterRequest, UserLoginRequest, UserDetailsResponse } from "../model/userModel";
import { repositoryWrapper } from "../repository/repositoryWrapper";
import logger from "../config/logger.config";

class AuthService {
    constructor(userData: Request) {
        // this.userData = userData;
    }

    async registerUser(req: UserRegisterRequest): Promise<UserLoginResponse> {
        logger.info('User registration attempt', { name: req.name, email: req.email, uniqueId: req.uniqueId });

        const isEmailExist = await repositoryWrapper.userRepository.findUser({ email: req.email });
        if (isEmailExist) {
            logger.warn('Registration failed: Email already exists', { email: req.email });
            throw new apiError("User with email already exists", 409);
        }

        const token = await createToken({ name: req.name, uniqueId: req.uniqueId }, "7d");
        if (!token) {
            logger.error('Token generation failed during registration');
            throw new apiError("Token generation failed", 500);
        }

        // Implement Password hashing here before saving to DB TODO
        await repositoryWrapper.userRepository.create({
            uniqueId: req.uniqueId,
            name: req.name,
            email: req.email,
            password: req.password,
        });

        logger.info('User registered successfully', { email: req.email, name: req.name });

        return {
            name: req.name,
            token,
        };
    }

    async loginUser(req: UserLoginRequest): Promise<UserLoginResponse> {
        logger.info('User login attempt', { email: req.email });

        const isUserExist = await repositoryWrapper.userRepository.findUser({ email: req.email, password: req.password });
        if (!isUserExist) {
            logger.warn('Login failed: Invalid credentials', { email: req.email });
            throw new apiError("Unauthorized user", 401);
        }

        const token = await createToken({ name: isUserExist.name!, uniqueId: isUserExist.uniqueId! }, "7d");
        if (!token) {
            logger.error('Token generation failed during login');
            throw new apiError("Token generation failed", 500);
        }

        logger.info('User logged in successfully', { email: req.email, name: isUserExist.name });

        return {
            name: isUserExist.name,
            token,
        };
    }

    async meAccount(token: string): Promise<UserDetailsResponse> {
        logger.info('User details attempt', { token });
        const decoded = await verifyToken(token);
        // Fetch all data from the database and send 


        return {
            name: decoded.name,
            email: "test@email.com", // TODO: get email from the database
            totalLinks: 16, // TODO: get total links from the database
            totalSharedLinks: 3, // TODO: get total shared links from the database
        };
    }
}

export default AuthService;