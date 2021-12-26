import './Film.css';

import {
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';
import $ from 'jquery';
import { toast } from 'react-toastify';

import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';
import { StreamContext } from '../../contexts/Stream/provider';

function Film(props) {
    const [, dispatch ] = useContext(SearchContext);
    const [, dispatchStream ] = useContext(StreamContext);
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

    const isEmpty = () => Object.keys(props.data).length === 0;
    
    const handleClick = e => {
        if(isEmpty()) return;
        
        imdbFetch(`${baseUrl}/YouTubeTrailer/$KEY/${props.data.imdbId || props.data.id}`).then(res => {
            dispatch({ type: 'set_popup', data: `https://www.youtube.com/embed/${res.videoId}` })
        }).catch(() => {});
    }
    
    const handleStar = e => {
        e.stopPropagation();
        if(isEmpty()) return;
        
        let { title, year, image, id } = props.data;
        if(!starred) axios.post(`${backendBaseUrl}/film/star/${id}/${title}/${year || -1}/${encodeURIComponent(image)}`, props.data)
        .then(() => setStarred(true))
        else axios.post(`${backendBaseUrl}/film/unstar/${props.data.title}`)
        .then(() => setStarred(false))
    }
    
    const handlePlay = e => {
        e.stopPropagation();

        const cancelToken = axios.CancelToken.source();
        let didCancel = false;

        // disable mouse input for the rest of the app
        $('.preventInput').addClass('show');

        toast.info(`Searching for torrent`, {
            position: "top-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => (didCancel = true) && cancelToken.cancel()
        });

        axios.get(`${backendBaseUrl}/stream/film/${props.data.title}`, {
            cancelToken: cancelToken.token
        }).then(res => {
            toast.dismiss();
            $('.preventInput').removeClass('show');

            const options = res.data.options;
            if(options){
                toast.success(`${options.length} torrents found.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                dispatchStream({ type: 'show_options', data: options })
                
                // save the title for later
                // when the player will look for subtitles
                dispatch({ type: 'set_title', data: props.data.title })
            }
            else {
                toast.error('Could not find torrent.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch(() => {
            toast.dismiss();
            $('.preventInput').removeClass('show');

            if(!didCancel)
            toast.error('Could not connect to backend.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    return (
        <div className={`film ${Object.keys(props.data).length === 0 ? 'hidden' : ''}`}>
            <div className="banner" style={{ background }} onClick={ handleClick }>
                <i className={`${ starred ? 'fas' : 'far' } fa-star`} onClick={ handleStar }></i>
                <i className="fas fa-play-circle" onClick={ handlePlay }></i>
            </div>
            <p className="title">{ props.data.title || '' }</p>
            <p className="duration"> { props.data.year ?  props.data.year === -1 ? '' : props.data.year : '' } </p>
        </div>
    );
}

export default memo(Film);