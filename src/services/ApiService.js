import axios from "axios";


const ApiService = axios.create({
    baseURL: process.env.REACT_APP_API
});

ApiService.interceptors.request.use(async (config) => {

    const userToken = await localStorage.getItem("token");

    if (userToken) {
        config.headers = {Authorization: `Bearer ${userToken}`}
    }

    return config;
});

ApiService.interceptors.response.use((response) => {
    return response.data;
}, (error) => {

    if (error.response.data.code && +error.response.data.code === 1001) {
        localStorage.removeItem('token');

        let uri = window.location.pathname;

        if (window.location.pathname) {
            window.location.href = '/login/#' + uri;
            return;
        }

        window.location.href = '/login';
    }

    throw (error.response || error.request).data;
});

export default ApiService;