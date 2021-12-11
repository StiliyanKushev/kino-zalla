import './Film.css';

import {
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';

function Film(props) {
    const [, dispatch ] = useContext(SearchContext);
    const [ starred, setStarred ] = useState(false);

    const highResImage = () => {
        let url = props.data.image;
        if(!url) return '';
        let med = '_V1_QL75_UX280_CR0,0,280,414_';
        let splited = url.split('.');
        splited[splited.length - 2] = med;
        url = splited.join('.');
        return url;
    }

    useEffect(() => {
        setStarred(props.data.starred);
    }, [props.data])

    const background = `linear-gradient(180deg, rgba(0, 0, 0, 0) 66.15%, #000000 100%), url(${highResImage()})`;

    const handleClick = e => {
        imdbFetch(`${baseUrl}/YouTubeTrailer/$KEY/${props.data.imdbId || props.data.id}`).then(res => {
            dispatch({ type: 'set_trailer', data: `https://www.youtube.com/embed/${res.videoId}` })
        })
    }

    const handleStar = e => {
        e.stopPropagation();
        let { title, year, image, id } = props.data;
        if(!starred) axios.post(`${backendBaseUrl}/film/star/${id}/${title}/${year}/${encodeURIComponent(image)}`, props.data)
        .then(() => setStarred(true))
        else axios.post(`${backendBaseUrl}/film/unstar/${props.data.title}`)
        .then(() => setStarred(false))
    }

    return (
        <div className={`film ${Object.keys(props.data).length === 0 ? 'hidden' : ''}`}>
            <div className="banner" style={{ background }} onClick={ handleClick }>
                <i className={`${ starred ? 'fas' : 'far' } fa-star`} onClick={ handleStar }></i>
                <i className="fas fa-play-circle"></i>
            </div>
            <p className="title">{ props.data.title || '' }</p>
            <p className="duration"> { props.data.year  || '' } </p>
        </div>
    );
}

export default memo(Film);