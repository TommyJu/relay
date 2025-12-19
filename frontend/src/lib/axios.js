import axios from "axios";


// Creates an Axios instance for sending requests to the backend server.
export const axiosInstance = axios.create( {
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" :  "/api",
    withCredentials: true,
} );