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

    //signup a user
    static async signup(data){
        let res = await this.request(`auth/register`, data, "post");
        return res.token;
    }

    //login a user
    static async login(data){
        let res = await this.request(`auth/token`, data, "post");
        return res.token;
    }

    //get info on a user by username
    static async getUserInfo(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }

    //save user's distrokid data to the server
    static async distrokidImport(data){

    }

    //save user's bandcamp data to the server
    static async bandcampImport(data){

    }

    //save user's spotify credentials to the server
    static async userSpotifyCredentials(data){
        
    }


}

export default StreamingApi;