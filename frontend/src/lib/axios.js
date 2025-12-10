import axios from "axios";


// Creates an Axios instance for sending requests to the backend server.
export const axiosInstance = axios.create( {
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
} );