import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    console.log("========== API ==========");
    console.log("Token:", token);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Headers:", config.headers);

    return config;
});

export default api;