import './Recommendations.css';

import {
    useContext,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';
import $ from 'jquery';
import { toast } from 'react-toastify';

import offlineBanner from '../../assets/offline-banner.png';
import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';
import { StreamContext } from '../../contexts/Stream/provider';

function Recommendations() {
    const [ state, dispatch ] = useContext(SearchContext);
    const [, dispatchStream ] = useContext(StreamContext);
    const [ slides, setSlides ] = useState([]);

    const getCurrentTitle = () => {
        for(let slide of $('.preview-section.real')){
            // eslint-disable-next-line eqeqeq
            if($($(slide)[0]).css('opacity') == 1) {
                let title = $($($($(slide)[0]).children()[1]).children()[1]).children()[0].textContent;
                return title;
            }
        }
    }

    const handlePlay = e => {
        e.preventDefault();
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

        axios.get(`${backendBaseUrl}/stream/film/${getCurrentTitle()}`,{
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

    const handleClick = item => {
        imdbFetch(`${baseUrl}/YouTubeTrailer/$KEY/${item.id}`).then(res => {
            dispatch({ type: 'set_popup', data: `https://www.youtube.com/embed/${res.videoId}` })
        }).catch(() => {});
    }

    // setup animations after slides are rendered in the dom
    useEffect(() => initializeSlideshow() , [slides]);

    // generate the slides after you get "recommended" in state
    useEffect(() => {
        if(state.recomended.length === 0) return;

        // only run once
        if(!state.recomendInitialized) 
        dispatch({ type: 'recomend-init' })
        else return;

        const background = url => 
        `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 83.85%), url(${url || offlineBanner})`
        
        setSlides(state.recomended.map(r => {
            return (
                <section className="preview-section real" onClick={ e => handleClick(r) } key={r.id}>
                    <div className="banner-image" style={{ background: background(r.thumbnailUrl) }} ></div>
                    <div className="bottom-holder">
                        <div alt="" className="preview-image" style={{ background: `url(${r.image})`}} />
                        <div>
                            <p className="title">{r.title}</p>
                            <p className="duration">{r.year}</p>
                        </div>
                    </div>
                </section>
            )
        }));
    // eslint-disable-next-line
    }, [state.recomended]);

    return (
        <div className="recomended">
            <h2>Препоръчани филми</h2>
            <div className="placeholder">
                <section className="preview-section dummy">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={offlineBanner} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                { slides }
            </div>
            <div className="controls">
                <button onClick={ handlePlay }>ГЛЕДАЙ</button>
                <ul className="pages">
                    <div className="relative-holder"><li className="selected"></li></div>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    );
}

function initializeSlideshow(){
    const _position = (i, el) => {
        let rightValue = -i * 105;
        $(el).css({right: rightValue + "%"});
        $(el).data('right', rightValue);
    }

    const _opacity = (i, el) => {
        if(i === 0) {
            $(el).data('current', true);
            $(el).css('opacity', '1');
        }
        else $(el).data('current', false);
    }

    const _control = (i, el) => {
        $(el).on('animation click', function(event){
            // cannot click when animation is running
            if($('.relative-holder .selected').data('anim')) return;

            let lis = $('.pages>li').get();
            let currentIndex = 0;

            // find the index of the currently selected button
            for(let index = 0; index < lis.length; index++){
                if($(lis[index]).data('current')){
                    currentIndex = index;
                    break;
                }
            }

            // return if pressing the curent index
            if(currentIndex === i) return;

            // update current
            $(el).data('current', true);
            $(lis[currentIndex]).data('current', false);

            
            let direction = i - currentIndex;
            sectionSlide(direction);
        });
    }

    let intervalCallback = () => {
        let lis = $('.pages>li').get();
        for(let i = 0; i < lis.length; i++){
            if($(lis[i]).data('current')){
                if(i === lis.length - 1){
                    $(lis[0]).trigger('animation');
                }
                else {
                    $(lis[i + 1]).trigger('animation');
                }
                break;
            }
        }
    }
    let interval = setInterval(intervalCallback, 8000);

    $('.preview-section.real').each(function (index) {
        _position(index, this);
        _opacity(index, this);
    });

    $('.relative-holder .selected').data('right', -2);
    $('.relative-holder .selected').css('right', '-2vw');

    $('.pages>li').each(function (index) {
        _control(index, this);
        $(this).data('current', index === 0 ? true : false);
    });

    $('.pages').on('click', (e) => {
        clearInterval(interval);
        interval = setInterval(intervalCallback, 8000);
    });

    document.addEventListener('visibilitychange', function() {
        if(document.hidden) {
            // tab is now inactive
            clearInterval(interval);
        }
        else {
            // tab is active again
            interval = setInterval(intervalCallback, 8000);
        }
    });
}

function sectionSlide(direction= -1){
    // animate the white page li
    let pageRight = $('.relative-holder .selected').data('right');
    if(direction >= 1) pageRight -= 2 * Math.abs(direction);
    else pageRight += 2 * Math.abs(direction);
    $('.relative-holder .selected').data('right', pageRight);
    $('.relative-holder .selected').data('anim', true);
    
    if(direction >= 1){
        $('.relative-holder .selected').animate({
            right: `${pageRight}vw`,
            width: `${(Math.abs(direction) * 2) + 1.1}vw`
        }, 300);
    }
    else {
        $('.relative-holder .selected').animate({
            width: `${(Math.abs(direction) * 2) + 1.1}vw`
        }, 300);
    }

    $('.relative-holder .selected').animate({
        right: `${pageRight}vw`,
        width: `1.2vw`
    }, 300, function() {
        $('.relative-holder .selected').data('anim', false);
    });


    let sections;
    if(direction >= 1) sections = $($('.preview-section.real').get().reverse());
    else sections = $('.preview-section.real');
    sections.each(function (index) {
        let currentRight = $(this).data('right');
        currentRight += (105 * direction);

        // animate position
        $(this).animate({ right: currentRight + "%" }, 600, () => {
            $(this).data('right', currentRight);
        });

        // animate opacity
        if($(this).data('current') === true){
            // set the current value to the next section
            $(this).data('current', false);
            $(sections[index - Math.abs(direction)]).data('current', true);

            $(this).animate({ opacity: 0.1 }, { duration: 600, queue: false });
            $(sections[index - Math.abs(direction)]).animate({ opacity: 1 }, { duration: 600, queue: false });
        }
    });
}

export default Recommendations;