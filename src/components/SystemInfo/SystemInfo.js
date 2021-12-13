import './SystemInfo.css';

import {
    memo,
    useEffect,
    useState,
} from 'react';

import { socket } from '../../config';

function SystemInfo() {
    const [ systemInformation, setSystemInformation ] = useState('Fetching system information...');

    useEffect(() => socket.on('system-info', msg => setSystemInformation(msg)) ,[]);

    return (
        <p className="system-information">{ systemInformation }</p>
    );
}

export default memo(SystemInfo);
