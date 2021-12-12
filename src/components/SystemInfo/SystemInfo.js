import './SystemInfo.css';

import {
    memo,
    useEffect,
    useState,
} from 'react';

import { backendBaseUrl } from '../../config';

function SystemInfo() {
    const [ systemInformation, setSystemInformation ] = useState('Fetching system information...');

    const tick = () => {
        fetch(`${backendBaseUrl}/sys/info`).then(res => res.json()).then(res => {
            setSystemInformation(res.data);
        }).catch(() => {})
    }

    useEffect(() => {
        tick();
        setInterval(() => {
            tick();
        },10000);
    },[]);

    return (
        <p className="system-information">{systemInformation}</p>
    );
}

export default memo(SystemInfo);
