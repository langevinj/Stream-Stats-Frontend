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

    //get user with username's distrokid data
    static async getUserDistrokidData(data, username){
        let res = await this.request(`distrokid/${username}`, data);
        return res.response;
    }


    //get user with username's bandcamp data
    static async getUserBandcampData(data, username){
        let res = await this.request(`bandcamp/${username}/${data.range}`);
        return res.response;
    }

    //save user's spotify credentials to the server, currently not in use
    // static async saveUserSpotifyCredentials(data){
    //     let res = await this.request(`spotify/saveCredentials`, data, "post");
    //     return res.token;
    // }

    //crawl Spotify and gather information for user
    static async gatherSpotifyData(data, username){
        let res = await this.request(`spotify/gatherData/${username}`, data, "post");
        return res.response;
    }

    //get user with username's spotify data
    static async getUserSpotifyData(data, username){
        let res = await this.request(`spotify/${username}/${data.range}`);
        return res.response;
    }

    //send data to import to the backend
    static async dataImport(data, username){
        let res = await this.request(`${data.endpoint}/import/${username}`, data, "post");
        return res.response;
    }

    //get an array of all songs the user has in their data
    static async getAllSongs(username){
        const res = await this.request(`users/allSongs/${username}`);
        return res.songs;
    }
}

export default StreamingApi;