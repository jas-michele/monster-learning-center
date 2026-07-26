import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

export async function registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    const response = await axios.post(`${API_URL}/register`, userData);

    return response.data;
}

export async function loginUser(credentials: {
    email: string;
    password: string;
}) {
    const response = await axios.post(`${API_URL}/login`, credentials)

    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
        "http://localhost:5001/api/auth/me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
        }
    );

    return response.data;
}