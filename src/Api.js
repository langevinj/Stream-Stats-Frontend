import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000"

/**
 * class containing methods for reaching out to API endpoint
 */
class StreamingApi {
    //where the local token gets saved
    static token;

    static async request(endpoint, data={}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_API_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${StreamingApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message: [message]
        }
    }
}

export default StreamingApi;