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
    static async distrokidImport(data, username){
        let res = await this.request(`distrokid/rawImport/${username}`, data, "post");
        return res.token;
    }

    //get user with username's distrokid data
    static async getUserDistrokidData(data, username){
        let res = await this.request(`distrokid/${username}`, data);
        return res.response;
    }

    //save user's alltime bandcamp data to the server
    static async bandcampAlltimeImport(data, username){
        let res = await this.request(`bandcamp/rawAlltimeImport/${username}`, data, "post");
        return res.token;
    }

    //save a user's month bandcamp data to the server
    static async bandcampMonthImport(data, username){
        let res = await this.request(`bandcamp/rawMonthImport/${username}`, data, "post");
        return res.token;
    }

    //get user with username's bandcamp data
    static async getUserBandcampData(data, username){
        let res = await this.request(`bandcamp/${username}`, data);
        return res.response;
    }

    //save user's spotify credentials to the server
    static async saveUserSpotifyCredentials(data){
        let res = await this.request(`spotify/saveCredentials`, data, "post");
        return res.token;
    }

    //crawl Spotify and gather information for user
    static async gatherSpotifyData(data, username){
        let res = await this.request(`spotify/gatherData/${username}`, data, "post");
        return res.token;
    }

    //save a user's spotify data for the past month to the server
    static async spotifyMonthImport(data, username){
        let res = await this.request(`spotify/rawMonthImport/${username}`, data, "post");
        return res.token;
    }

    //save a user's spotify data for all time
    static async spotifyAlltimeImport(data, username){
        let res = await this.request(`spotify/rawAlltimeImport/${username}`, data, "post");
        return res.token;
    }

    //get user with username's spotify data
    static async getUserSpotifyData(data, username){
        let res = await this.request(`spotify/${username}`, data);
        return res.response;
    }

    //send data to import to the backend
    static async dataImport(data, username){
        let res = await this.request(`${data.endpoint}/import/${username}`, data, "post");
        return res.response;
    }


}

export default StreamingApi;