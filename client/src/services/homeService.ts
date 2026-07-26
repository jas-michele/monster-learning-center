import axios from "axios";

const API_URL = "http://localhost:5001/api";

export async function getHomeData(token: string) {
    const response = await axios.get(`${API_URL}/home`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    return response.data;
}