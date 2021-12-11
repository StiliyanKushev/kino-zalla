import { toast } from 'react-toastify';

import apiKeys from './apiKeys.js'; // this file returns an array of keys

export const baseUrl = 'https://imdb-api.com/en/API';
export const backendBaseUrl = 'http://192.168.1.146:4343'; // change this to your local machine ip

export let apiKeyIndex = 0;
export const nextKey = () => apiKeyIndex++;
export const apiKey = () => apiKeys[apiKeyIndex]
export const imdbFetch = async (url, calledFromSelf=false) => {
    // replace $KEY with a api key
    const mod = key => url.replace('$KEY', key)
    if(apiKeyIndex >= apiKeys.length) apiKeyIndex = 0;
    for(let i = 0; i < apiKeys.length; i++){
        try {
            console.log(`trying [${apiKeyIndex}] ${apiKey()}...`);
            let response = await (await fetch(mod(apiKey()))).json();
            if(response.errorMessage.length > 0) throw Error;
            console.log(`${apiKey()} worked!`);
            return response;
        } catch { 
            console.log(`${apiKey()} is not working...`);
            nextKey()
        }
    }

    // try them again from start to finish (maybe you get lucky)
    if(!calledFromSelf) return imdbFetch(url, true);
    else {
        toast.error('Неуспешна връзка с imdb. Всички ключове са спрени.', {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
}