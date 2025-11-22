import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../components';
import { login, signup } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/slices/AuthSlice';
import type { AppDispatch } from '../../redux/store';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { StandardErrorResponse } from '../../utils';
import { cn } from '../../utils';

interface CustomJwtPayload extends JwtPayload {
    name: string;
    uniqueId: string;
}

interface SignInUpProps {
    onSuccess?: () => void;
}

type FormData = {
    email: string;
    password: string;
    name?: string;
};

const SignInUp: React.FC<SignInUpProps> = ({ onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setLoginError(null);
        reset();
    };

    const getAllErrors = (): string | null => {
        const validationErrors: string[] = [];
        if (errors.name?.message) {validationErrors.push(errors.name.message);}
        if (errors.email?.message) {validationErrors.push(errors.email.message);}
        if (errors.password?.message) {validationErrors.push(errors.password.message);}
        if (loginError) {validationErrors.push(loginError);}
        return validationErrors.length > 0 ? validationErrors.join('. ') : null;
    };
    
    const handleAuth = (token: string, decodedToken: CustomJwtPayload) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', decodedToken.name);
        localStorage.setItem('uniqueId', decodedToken.uniqueId);
        dispatch(setAuth({
            status: true,
            token,
            user: decodedToken.name,
            uniqueId: decodedToken.uniqueId
        }));
        onSuccess?.();
        navigate('/dashboard');
    };

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setLoginError(null);

        try {
            const response = isSignUp
                ? await signup({ ...data, name: data.name!, uniqueId: crypto.randomUUID() })
                : await login(data);

            const decodedToken = jwtDecode<CustomJwtPayload>(response.data.token);
            handleAuth(response.data.token, decodedToken);

        } catch (error: unknown) {
            const apiError = error as StandardErrorResponse;
            const errorMessage = apiError.data?.message || `${isSignUp ? 'Sign up' : 'Login'} failed`;
            const errorDetails = apiError.data?.errors;
            setLoginError(errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('z-10 flex justify-center items-center')}>
            <form onSubmit={handleSubmit(onSubmit)} className={cn('bg-form-background-dark dark:bg-form-footer-background m-auto w-[280px] sm:w-[20em] md:w-[22em] rounded-lg')}>
                <div className={cn('bg-form-footer-background-dark dark:bg-form-background rounded-lg border-none p-8')}>
                    <h1 className={cn('text-xl text-text-300 dark:text-text-dark-100 font-semibold')}>
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </h1>
                    <p className={cn('text-sm text-text-300 dark:text-text-dark-100 my-2')}>
                        {isSignUp ? 'Create your account' : 'Enter your email and password'}
                    </p>

                    <div className={cn('mt-6 space-y-4')}>
                        {isSignUp && (
                            <>
                                <Input
                                    className={cn('dark:text-text-dark-200 border-b-1 border-black/15 dark:border-white/15')}
                                    placeholder="Full Name"
                                    {...register('name', {
                                        required: 'Name is required', 
                                    })}
                                />
                            </>
                        )}

                        <Input
                            className={cn('dark:text-text-dark-200 border-b-1 border-black/15 dark:border-white/15')}
                            placeholder="Email"
                            {...register('email', {
                                required: 'Email is required',
                            })}
                        />

                        <Input
                            className={cn('dark:text-text-dark-200 border-b-1 border-black/15 dark:border-white/15')}
                            placeholder="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                        />

                        {/* Here showing all consolated error */}
                        {getAllErrors() && (
                            <p className={cn('text-text-denger text-sm')}>
                                {getAllErrors()}
                            </p>
                        )}

                        <div className={cn('w-full h-11 flex justify-center items-center')}>
                            <Button variant="twich" disabled={isLoading}>
                                {isLoading
                                    ? (isSignUp ? 'Creating...' : 'Signing in...')
                                    : (isSignUp ? 'Sign up' : 'Sign in')
                                }
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={cn('h-15 flex justify-center items-center px-2')}>
                    <h1 className={cn('text-[0.8em] dark:text-text-dark-100')}>
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <span
                            onClick={toggleMode}
                            className={cn('cursor-pointer font-bold ml-1 dark:hover:text-text-dark-300 transition-colors')}>
                            {isSignUp ? 'Sign in!' : 'Sign up, it\'s free!'}
                        </span>
                    </h1>
                </div>
            </form>
        </div>
    );
};

export default SignInUp;