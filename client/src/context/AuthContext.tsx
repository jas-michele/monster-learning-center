import React, { Children, createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/authService";
import { data } from "react-router-dom";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    level: number;
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps ) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser= async () => {
            try {
                const data = await getCurrentUser();

                setUser(data.user);

            } catch (error) {
                console.error("Unable to load user", error);

                localStorage.removeItem("token");
            }
        };

        if (localStorage.getItem("token")) {
            loadUser();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>    
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}