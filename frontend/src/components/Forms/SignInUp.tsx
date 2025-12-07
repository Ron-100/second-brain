import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, LoadingSpinner } from '../../components';
import { useLoginMutation, useSignupMutation } from '../../redux/api/authApi';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { handleApiError } from '../../utils';
import { cn } from '../../utils';
import { saveAuthStorage } from '../../helper/authHelpers';

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
    const [loginError, setLoginError] = useState<string | null>(null);
    const navigate = useNavigate();

    // RTK Query hooks
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
    const isLoading = isLoginLoading || isSignupLoading;

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
        saveAuthStorage(token, decodedToken.name, decodedToken.uniqueId);
        onSuccess?.();
        navigate('/dashboard');
    };

    const onSubmit = async (data: FormData) => {
        setLoginError(null);

        try {
            const response = isSignUp
                ? await signup({ name: data.name!, email: data.email, password: data.password }).unwrap()
                : await login({ email: data.email, password: data.password }).unwrap();

            const decodedToken = jwtDecode<CustomJwtPayload>(response.data.token);
            handleAuth(response.data.token, decodedToken);

        } catch (error: unknown) {
            const apiError = handleApiError(error, `${isSignUp ? 'Sign up' : 'Login'} failed`);
            setLoginError(apiError.data.errors ? `${apiError.data.message}: ${apiError.data.errors}` : apiError.data.message);
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
                                    placeholder="Full Name"
                                    variant="LoginInput"
                                    {...register('name', {
                                        required: 'Name is required', 
                                    })}
                                />
                            </>
                        )}

                        <Input
                            placeholder="Email"
                            variant="LoginInput"
                            {...register('email', {
                                required: 'Email is required',
                            })}
                        />

                        <Input
                            placeholder="Password"
                            variant="LoginInput"
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
                            <Button 
                                variant="LoginButton" 
                                disabled={isLoading}>
                                {isLoading
                                    ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <LoadingSpinner size="sm" />
                                            {isSignUp ? 'Creating...' : 'Signing in...'}
                                        </span>
                                    )
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