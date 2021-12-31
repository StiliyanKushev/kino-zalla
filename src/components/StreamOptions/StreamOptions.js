import './StreamOptions.css';

import {
    useContext,
    useEffect,
    useState,
} from 'react';

import { backendBaseUrl } from '../../config';
import { SearchContext } from '../../contexts/Search/provider';
import { StreamContext } from '../../contexts/Stream/provider';

function StreamOptions() {
    const [ state, dispatch ] = useContext(StreamContext);
    const [, dispatchSearch ] = useContext(SearchContext);
    const [ options, setOptions ] = useState([]);
    
    const handleClose = e => {
        dispatch({ type: 'hide_options' });
    }

    const handleClick = f => {
        handleClose();
        dispatchSearch({ type: 'set_popup', data: `${backendBaseUrl}/stream/play/${encodeURIComponent(f.magnet)}` })
    }

    useEffect(() => {
        setOptions(state.filmOptions.map(f => (
            <div key={Math.random()} className="stream-option" onClick={ () => handleClick(f) }>
                <p>{f.name} | {f.seeds} seeds | {f.size}</p>
            </div>
        )))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.visible, state.filmOptions])

    return (
        <>
            {
                state.visible ? (
                    <div className="stream-options-overlay">
                        <div className="container">
                            <div className="choose-div">
                                <p className='choose'>Избери торент за връзка</p>
                                <i className="fas fa-times" onClick={ handleClose }></i>
                            </div>
                            { options }
                        </div>
                    </div>
                ) : '' 
            }
        </>
    );
}

export default StreamOptions;
