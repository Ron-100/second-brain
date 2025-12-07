// Clear all auth data from localStorage
export const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('uniqueId');
};

// Save auth data to localStorage
export const saveAuthStorage = (token: string, user: string, uniqueId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    localStorage.setItem('uniqueId', uniqueId);
};

// Check if user is authenticated
export const isAuthenticated = () => !!localStorage.getItem('token');
