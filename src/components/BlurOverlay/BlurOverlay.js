import './BlurOverlay.css';

import {
    useContext,
    useEffect,
} from 'react';

import $ from 'jquery';

import { SearchContext } from '../../contexts/Search/provider';

function BlurOverlay() {
    const [ state, dispatch ] = useContext(SearchContext);
    const handleClose = e => dispatch({ type: 'set_popup', data: '' })
    
    // hide and show trailer when state changes
    useEffect(() => state.popupLink === '' ? hidePopup(state.popupLink) : showPopup(state.popupLink), [state.popupLink]);
    
    return (
        <>
            <div className="blur">
                <div className="trailer-container">
                    <div>
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
                                <video crossOrigin="anonymous" controls>
                                    <source src={ state.popupLink } type="video/mp4" />
                                </video>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function hidePopup(link){
    if(!link.includes('youtube')){
        // load the video tag
        let video = document.querySelector('.blur video');
        video.pause();
    }
    else {
        $('.blur iframe').attr('src', $('.blur iframe').attr('src'));
    }
    $('.blur').removeClass('functional');
    $('.blur').css('opacity', 0);
}

function showPopup(link){
    if(!link.includes('youtube')){
        // load the video tag
        let video = document.querySelector('.blur video');
        let source = document.querySelector('.blur video source');
        source.src += `?r=${Date.now()}`
        video.load();
        video.play();
    }
    $('.blur').addClass('functional');
    $('.blur').css('padding-top', '30%');
    $('.blur').animate({ opacity: 1, "padding-top": "0px" }, 300);
}

export default BlurOverlay;
