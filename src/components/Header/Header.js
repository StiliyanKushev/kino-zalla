import './Header.css';

import { useContext } from 'react';

import {
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';
import Select from '../../shared/Select/Select';

function Header() {
    const [ state, dispatch ] = useContext(SearchContext);

    const handleRandom = e => {
        e.preventDefault();
        let randomPage = Math.floor(Math.random() * state.maxPages) + 1;
        dispatch({ type: 'set_page', data: { index: randomPage, from: 'header' } })
    }

    const handlePopular = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/MostPopularMovies/$KEY`).then(res => {
            dispatch({ type: 'set_page', data: { index: 0, from: 'header', maxPages: Math.max(res.items / 10, 1) } })
            dispatch({ type: 'save_top', data: res.items });
        });
    }

    const handleTop250 = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/Top250Movies/$KEY`).then(res => {
            dispatch({ type: 'set_page', data: { index: 0, from: 'header', maxPages: Math.max(res.items / 10, 1) } })
            dispatch({ type: 'save_top', data: res.items });
        })
    }
    
    const handleInTheaters = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/InTheaters/$KEY`).then(res => {
            dispatch({ type: 'set_page', data: { index: 0, from: 'header', maxPages: Math.max(res.items / 10, 1) } })
            dispatch({ type: 'save_top', data: res.items });
        })
    }

    return (
        <header>
            <select id="width_tmp_select"><option id="width_tmp_option"></option></select>
            <form>
                <Select options={[
                    ['other', 'Настройки'],
                    ['starred', 'Любими'],
                    ['not-starred', 'Нелюбими'],
                    ['all', 'Всички'],
                ]}/>
                <button onClick={ handlePopular } className="actionBtn" >Популярни</button>
                <button onClick={ handleTop250 } className="actionBtn" >Топ 250</button>
                <button onClick={ handleInTheaters } className="actionBtn" >В кината</button>
                <button onClick={ handleRandom } className="actionBtn" >Рандъм</button>
            </form>
            <i className="fas fa-cog"></i>
        </header>
    );
}

export default Header;