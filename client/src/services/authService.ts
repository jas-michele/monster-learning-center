import api from "./api";

export async function registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    const response = await api.post("/auth/register", userData);

    return response.data;
}

export async function loginUser(credentials: {
    email: string;
    password: string;
}) {
    const response = await api.post("/auth/login", credentials)

    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get( "/auth/me");

    return response.data;
}