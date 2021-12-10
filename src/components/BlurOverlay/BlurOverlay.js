import './BlurOverlay.css';

import {
    useContext,
    useEffect,
} from 'react';

import $ from 'jquery';

import { SearchContext } from '../../contexts/Search/provider';

function BlurOverlay() {
    const [ state, dispatch ] = useContext(SearchContext);
    const handleClose = e => dispatch({ type: 'set_trailer', data: '' })
    
    // hide and show trailer when state changes
    useEffect(() => state.trailerLink === '' ? hideTrailer() : showTrailer(), [state.trailerLink])

    return (
        <>
            <div className="blur">
                <div className="trailer-container">
                    <div>
                        <div className="close" onClick={ handleClose }>Затвори</div>
                        <iframe title='Trailer' src={ state.trailerLink } frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media;" allowFullScreen></iframe>
                    </div>
                </div>
            </div>
        </>
    );
}

function hideTrailer(){
    $('.blur iframe').attr('src', $('.blur iframe').attr('src'));
    $('.blur').removeClass('functional');
    $('.blur').css('opacity', 0);
}

function showTrailer(){
    $('.blur').addClass('functional');
    $('.blur').css('padding-top', '30%');
    $('.blur').animate({ opacity: 1, "padding-top": "0px" }, 300);
}

export default BlurOverlay;
