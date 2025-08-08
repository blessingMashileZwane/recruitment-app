import { createContext, useContext, useState, type ReactNode } from "react";
import { mockGraphQL } from "../mock/mockData";
import type { AuthContextType, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const authenticatedUser = await mockGraphQL.authenticate(email, password);
            if (authenticatedUser) {
                setUser(authenticatedUser);
                setIsLoggedIn(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const loginWithSSO = async (): Promise<boolean> => {
        try {
            const authenticatedUser = await mockGraphQL.authenticateSSO();
            if (authenticatedUser) {
                setUser(authenticatedUser);
                setIsLoggedIn(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('SSO login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, loginWithSSO, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;