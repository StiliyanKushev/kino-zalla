import './Select.css';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

function Select(props) {
    const [isFocused, setFocus] = useState(false);
    const [currentWidth, setCurrentWidth] = useState('fit-content');
    const selectEl = useRef();

    // generate the options dynamically
    let options = props.options.map((option, index) => {
        let [value, text] = option;
        if(index === 0) 
        return <option key={text} value={value} disabled hidden>{text}</option>
        return <option key={text} value={value}>{text}</option>
    })

    // fix a bug with focus/blur not working consistently on <select>
    const onOutsideClick = () => {
        document.body.addEventListener('click', (e) => {
            if(!selectEl.current) return;
            let { top, left, bottom, right } = selectEl.current.getBoundingClientRect();
            if(!(e.clientX >= left && e.clientX <= right && e.clientY >= top && e.clientY <= bottom))
            setFocus(false);
        })
    }

    // convert pixel values to vw
    const pxToVw = px => 100 * px / window.innerWidth;

    // make <select> tag width dynamic based on content
    const fixWidth = () => {
        if(!selectEl.current) return;
        let selectedText = selectEl.current.selectedOptions[0].innerText;
        document.querySelector('#width_tmp_option').innerHTML = selectedText;
        let tmpW = document.querySelector('#width_tmp_select').getBoundingClientRect().width;
        setCurrentWidth(`${pxToVw(tmpW) + 3}vw`);
    }

    useEffect(() => {
        onOutsideClick();
        fixWidth();
    })

    return (
        <select
            ref={ selectEl }
            style={{ width: currentWidth }}
            className={ isFocused ? 'arrow_up' : 'arrow_down' }
            defaultValue={ props.options[0][0] }
            onClick={ () => setFocus(!isFocused) }
            onMouseDown= { () => setFocus(!isFocused) }
            onChange={ fixWidth }
        > { options } </select>
    );
}

export default Select;
