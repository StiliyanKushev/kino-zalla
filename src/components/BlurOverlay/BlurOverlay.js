import './BlurOverlay.css';

import {
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import axios from 'axios';
import $ from 'jquery';
import { useIdleTimer } from 'react-idle-timer';

import { backendBaseUrl } from '../../config';
import { SearchContext } from '../../contexts/Search/provider';

function BlurOverlay() {
    const [ searchState ] = useContext(SearchContext);
    const [ state, dispatch ] = useContext(SearchContext);
    const [ subtitles, setSubtitles ] = useState([]);

    // returns a blob url with the movies subtitles
    const fetchSubs = async e => {
        // fetch subs content
        let subsContent = (await axios.get(`${backendBaseUrl}/stream/subs/${searchState.currentFilmName}`)).data.subs;

        // generate blob url for the subs
        const subobj = new Blob([subsContent],{ type: "text/vtt" });
        return URL.createObjectURL(subobj);
    }

    // on subtitles update
    const onCuesChange = cues => {
        // convert all html5 video cues to one text
        let rows = [];
        for(let i = 0; i < cues.length; i++) rows.push(cues[i].text)
        setSubtitles(rows.map(r => <div key={r} className="subtitles-row">{ r }</div>));
    }

    const handleClose = e => {
        // watching a movie (not a trailer)
        if(!state.popupLink.includes('youtube')){
            // https://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-video-and-close-socket-or-connection/32275851
            let video = document.querySelector('.blur video');
            let source = document.querySelector('.blur video source');
            video.pause();
            source.src = `data:video/mp4;base64, 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`;
            video.load();

            // reset state values
            setVolume(100);
            setTimestamp('');
            setSubtitles([]);
            setIsMuted(false);
            setLastVolume(100);
            setIsPlaying(false);
            setShowControls(true);
            setIsFullscreen(false);
            setControlsEnabled(false);
        }
        dispatch({ type: 'set_popup', data: '' })
        dispatch({ type: 'set_title', data: '' })
    }

    const onShow = popupLink => {
        // animate the blur html content
        showPopup(popupLink);

        if(popupLink.includes('youtube')) return;
        // fetch the subs for the film and create track element
        (async () => {
            let videoElement = document.querySelector('video');
            let track = document.createElement("track");                
            track.kind = "subtitles";
            track.label = "Bulgarian";
            track.srclang = "bg";
            track.src = await fetchSubs();
            //track.src = 'http://localhost:3001/dummy_subs.vtt'

            // update the custom subtitles element
            track.addEventListener('cuechange', function () {
                let cues = this.track.activeCues; 
                onCuesChange(cues);
            });

            // add the track element to the video tag
            videoElement.append(track);

            // hide the default track elements
            // because I'm using custom ones I can style
            track.mode = "hidden";
            videoElement.textTracks[0].mode = "hidden";

            // load the video tag
            let source = document.querySelector('.blur video source');
            source.src += `?r=${Date.now()}`
            videoElement.load();
            videoElement.play();
        })();
    }

    const onHide = popupLink => {
        // hide the blur html elements
        hidePopup(popupLink);

        // remove the subtitles
        document.querySelectorAll('track').forEach(e => e.remove());
    }

    // hide and show trailer when state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => state.popupLink === '' ? onHide(state.popupLink) : onShow(state.popupLink), [state.popupLink]);

    /* 
        The following functions
        are event handlers for 
        the custom video player (not for the trailer preview)
    */

    // global ref for the video element
    // that the custom controls will use
    const _video = useRef();
    const _loaded = useRef(false);

    // this container element is fullscreen'ed
    const _playerContainer = useRef();

    // custom controls state
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ isFullscreen, setIsFullscreen ] = useState(false);
    
    // should you show video controls (only on mouse hover)
    const [ showControls, setShowControls ] = useState(false);
    const [ controlsEnabled, setControlsEnabled ] = useState(false);

    // listen for idle and hide controls
    useIdleTimer({
        timeout: 5000,
        debounce: 500,
        onIdle: () => setShowControls(false),
    })

    // keep track of volume values
    const [ volume, setVolume ] = useState(100);
    const [ isMuted, setIsMuted ] = useState(false);
    const [ lastVolume, setLastVolume ] = useState(100);

    // handle default video events
    useEffect(() => {
        if(state.popupLink.includes('youtube') || !state.popupLink.length) return;
        
        _video.current.addEventListener('play', () => _loaded.current && setIsPlaying(true));
        _video.current.addEventListener('pause', () => setIsPlaying(false));
        _video.current.addEventListener('loadeddata', () => {
            // enable the controls
            setControlsEnabled(true);

            // override default volume set by browser
            _video.current.volume = volume / 100;

            $('#progress').attr('max', _video.current.duration);
            _loaded.current = true;
            setIsPlaying(true);
        });
        _video.current.addEventListener('timeupdate', () => {
            $('#progress').val(_video.current.currentTime);
            $('#progress-bar').css('width', Math.floor((_video.current.currentTime / _video.current.duration) * 100) + '%');
            setTimestamp(currentVideoTime());
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.popupLink]);

    // on play/pause button press
    const onPlay = e => {
        setIsPlaying(!isPlaying);
        if (_video.current.paused || _video.current.ended) _video.current.play();
        else _video.current.pause();
    }

    // on timeline click
    const onProgress = e => {
        const pos = (e.pageX - e.target.getBoundingClientRect().left) / e.target.clientWidth;
        _video.current.currentTime = pos * _video.current.duration;
    }

    // on expand/collapse button press
    const onExpand = e => {
        setIsFullscreen(!isFullscreen);
        if (isFullscreen) {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
         }
         else {
            if (_playerContainer.current.requestFullscreen) _playerContainer.current.requestFullscreen();
            else if (_playerContainer.current.mozRequestFullScreen) _playerContainer.current.mozRequestFullScreen();
            else if (_playerContainer.current.webkitRequestFullScreen) _playerContainer.current.webkitRequestFullScreen();
            else if (_playerContainer.current.msRequestFullscreen) _playerContainer.current.msRequestFullscreen();
         }
    }

    // on volume change slider value
    const onVolumeChange = e => {
        setVolume(e.target.value);
        setLastVolume(e.target.value);
        _video.current.volume = e.target.value / 100;

        // if used changed volume then unmute
        if(isMuted) setIsMuted(false);
    }

    // on volume button press
    const onVolume = e => {
        setIsMuted(!isMuted);
        if(!isMuted) {
            setVolume(0);
            setLastVolume(volume);
            _video.current.volume = 0;
        }
        else {
            setVolume(lastVolume);
            _video.current.volume = lastVolume / 100;
        }
    }

    // this holds the current/duration of the movie as string
    const [ timestamp, setTimestamp ] = useState('');

    // returns the timestamp data
    const currentVideoTime = () => {
        try {
            const duration = new Date(_video.current.duration * 1000).toISOString().substr(11, 8);
            const current = new Date(_video.current.currentTime * 1000).toISOString().substr(11, 8);
            return `${current} / ${duration}`;
        } catch { return '00:00 / 00:00' /* video element not visible */ }
    }

    return (
        <div className="blur">
            <div className="trailer-container">
                <div
                    ref={ _playerContainer }
                    className="blur-content-container"
                    onMouseMove={ e => setShowControls(true) }
                    onMouseOut={ e=> setShowControls(false) }
                >
                    <div className="close" onClick={ handleClose }>Затвори</div>
                    {
                        state.popupLink.includes('youtube') ? (
                            <iframe 
                            title='Trailer'
                            src={ state.popupLink } 
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media;"
                            allowFullScreen></iframe>
                        ) : (
                            <>
                                <video ref={ _video } crossOrigin="anonymous">
                                    <source src={ state.popupLink } type="video/mp4" />
                                </video>
                                <div className={`subtitles ${!showControls && 'noControls'}`}>
                                    { subtitles }
                                </div>
                                <div className={`video-controls ${!showControls && 'hidden'} ${!controlsEnabled && 'disabled'}`}>
                                    <div className="top-row">
                                        <div className="left">
                                            <i 
                                                onClick={ onPlay }
                                                className={`play ${isPlaying ? 'fas fa-pause' : 'fas fa-play'}`}>
                                            </i>
                                            <span>{ timestamp }</span>
                                        </div>
                                        <div className="right">
                                            <div className="volume-contrainer">
                                                <input
                                                    onChange={ onVolumeChange }
                                                    type="range"
                                                    min={1} max={100} value={ volume }
                                                    className="volumeSlider"/>
                                                <i 
                                                    className={`volumeIcon ${!isMuted ? 'fas fa-volume' : 'fas fa-volume-mute'}`}
                                                    onClick={ onVolume }
                                                    ></i>
                                            </div>
                                            <i
                                                onClick={ onExpand }
                                                className={`${isFullscreen ? 'fas fa-compress' : 'fas fa-expand'}`}>
                                            </i>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <progress 
                                            onClick={ onProgress }
                                            id="progress"
                                            value="0"
                                            min="0"
                                        >
                                            <span id="progress-bar"></span>
                                        </progress>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

function hidePopup(link){
    $('.blur iframe').attr('src', $('.blur iframe').attr('src'));
    $('.blur').removeClass('functional');
    $('.blur').css('opacity', 0);
}

function showPopup(link){
    $('.blur').addClass('functional');
    $('.blur').css('padding-top', '30%');
    $('.blur').animate({ opacity: 1, "padding-top": "0px" }, 300);
}

export default BlurOverlay;