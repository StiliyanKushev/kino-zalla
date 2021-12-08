import './Recommendations.css';

import { useEffect } from 'react';

import $ from 'jquery';

import spidermanPreview from '../../assets/spiderman-preview.png';

function Recommendations() {
    useEffect(() => {
        initializeSlideshow();
    });

    return (
        <div className="recomended">
            <h2>Препоръчителни филма</h2>
            <div className="placeholder">
                <section className="preview-section dummy">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
                <section className="preview-section real">
                    <div className="banner-image"></div>
                    <div className="bottom-holder">
                         <img alt="" className="preview-image" src={spidermanPreview} />
                        <div>
                            <p className="title">Spider-Man: No Way Home</p>
                            <p className="duration">2 ч 28 мин</p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="controls">
                <button>ГЛЕДАЙ</button>
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
        $(el).on('click', function(){
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

    setInterval(() => {
        let lis = $('.pages>li').get();
        for(let i = 0; i < lis.length; i++){
            if($(lis[i]).data('current')){
                if(i === lis.length - 1){
                    $(lis[0]).trigger('click');
                }
                else {
                    $(lis[i + 1]).trigger('click');
                }
                break;
            }
        }
    }, 8000);
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