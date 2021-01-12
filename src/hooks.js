import { useState, useEffect } from 'react'

//custom hook for utilizing localStorage, return a value from storage and a function to set value in storage
function useLocalStorage(key, startingValue = null) {
    const initialValue = localStorage.getItem(key) || startingValue;

    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        if (!value) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value)
        }
    }, [key, value]);

    return [value, setValue]
}

export default useLocalStorage;