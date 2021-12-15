import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

// this file returns an array of keys
import apiKeys from './apiKeys.json';

// change this to your PCs local ip if running locally
// or your public ip if running it globally
export const ip = '192.168.1.146';

export const baseUrl = 'https://imdb-api.com/en/API';
export const backendBaseUrl = `http://${ip}:4343`;
export const socket = io(`http://${ip}:4343`);

let keyStatus = {}

export let apiKeyIndex = 0;
export let allBlocked = false;
export const nextKey = () => apiKeyIndex++;
export const apiKey = () => apiKeys[apiKeyIndex];
export const imdbFetch = async (url, calledFromSelf=false) => {
    // dont't use keys that don't work (will suspend your account)
    if(allBlocked){
        toastError();
        return;
    }

    // replace $KEY with a api key
    const mod = key => url.replace('$KEY', key)
    if(apiKeyIndex >= apiKeys.length) apiKeyIndex = 0;
    for(let i = 0; i < apiKeys.length; i++){
        if(!keyStatus[apiKey()]) keyStatus[apiKey()] = true;
        else if(keyStatus[apiKey()] === false) continue;
        try {
            console.log(`trying [${apiKeyIndex}] ${apiKey()}...`);
            let response = await (await fetch(mod(apiKey()))).json();
            if(response.errorMessage.length > 0){
                console.log(response.errorMessage);
                if(!response.errorMessage.includes('404')) throw Error;
            }
            console.log(`${apiKey()} worked!`);
            return response;
        } catch { 
            keyStatus[apiKey()] = false;
            console.log(`${apiKey()} is not working...`);
            nextKey()
        }
        if(apiKeyIndex >= apiKeys.length) break;
    }

    // try them again from start to finish (maybe you get lucky)
    if(!calledFromSelf) return imdbFetch(url, true);
    else {
        allBlocked = true;
        toastError();
    }
}

export default function toastError(msg) {
    toast.error(msg || 'Неуспешна връзка с imdb. Всички ключове са спрени.', {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}