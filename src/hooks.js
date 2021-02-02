// import { useState, useEffect } from 'react';
const { useState, useEffect } = require('react');

//custom hook for utilizing localStorage, return a value from storage and a function to set value in storage
function useLocalStorage(key, startingValue = null) {
    const initialValue = localStorage.getItem(key) || startingValue;

    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        if (!value) {
            if(key === "data"){
                localStorage.setItem(key, { distrokid: [], bandcamp_alltime: [], bandcamp_month: [], spotify_alltime: [], spotify_month: [] })
            } else {
                localStorage.removeItem(key);
            }
            
        } else {
            localStorage.setItem(key, value)
        }
    }, [key, value]);

    return [value, setValue]
}


export default useLocalStorage;