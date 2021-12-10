import apiKeys from './apiKeys.js'; // this file returns an array of keys

export const baseUrl = 'https://imdb-api.com/en/API';
export const backendBaseUrl = 'http://localhost:4343';

let apiKeyIndex = 0;
export const nextKey = () => apiKeyIndex++;
export const apiKey = () => apiKeys[apiKeyIndex]
export const imdbFetch = async url => {
    // replace $KEY with a api key
    const mod = key => url.replace('$KEY', key)
    if(apiKeyIndex >= apiKeys.length - 1) apiKeyIndex = 0;
    for(let i = 0; i < apiKeys.length; i++){
        try {
            console.log(`trying ${apiKey()}...`);
            let response = await (await fetch(mod(apiKey()))).json();
            if(response.errorMessage.length > 0) throw Error;
            console.log(`${apiKey()} worked!`);
            return response;
        } catch { 
            console.log(`${apiKey()} is not working...`);
            nextKey()
        }
    }

    alert('Oops, none of the keys worked.');
}