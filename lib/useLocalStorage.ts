import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any): any {
    // getting stored value
    if(typeof window !== 'undefined') {
        const saved: string | null = localStorage.getItem(key);
        const initial: any = JSON.parse(saved);
        return initial || defaultValue;
    }
    return ('');
}

export const useLocalStorage = (key: string, defaultValue: any): [any, (value: any) => void] => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        // storing input name
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};