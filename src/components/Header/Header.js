import './Header.css';
import 'react-toastify/dist/ReactToastify.css';

import { useContext } from 'react';

import axios from 'axios';
import {
    toast,
    ToastContainer,
} from 'react-toastify';

import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';

function Header() {
    const [ state, dispatch ] = useContext(SearchContext);

    const setFirstPage = () => {
        dispatch({ type: 'set_page', data: { index: 0, from: 'header' } })
    }

    const handleRandom = e => {
        e.preventDefault();
        let randomPage = Math.floor(Math.random() * state.maxPages) + 1;
        dispatch({ type: 'set_page', data: { index: randomPage, from: 'header' } })
    }

    const handlePopular = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/MostPopularMovies/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        });
    }

    const handleTop250 = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/Top250Movies/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        })
    }
    
    const handleInTheaters = e => {
        e.preventDefault();
        imdbFetch(`${baseUrl}/InTheaters/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        })
    }

    const handleFavorite = e => {
        e.preventDefault();
        axios.get(`${backendBaseUrl}/film/getStarredAll`).then(res => {
            if(res.data.data.length === 0){
                toast.error('Няма запазени любими', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            
            let maxPages = Math.ceil(res.data.data.length / 10)
            dispatch({ type: 'set_page', data: { index: 0, from: 'header', max: maxPages }})
            dispatch({ type: 'save_data', data: res.data.data });
        })
    }

    return (
        <header>
            <select id="width_tmp_select"><option id="width_tmp_option"></option></select>
            <form>
                <button onClick={ handlePopular } className="actionBtn" >Популярни</button>
                <button onClick={ handleFavorite } className="actionBtn" >Любими</button>
                <button onClick={ handleTop250 } className="actionBtn" >Топ 250</button>
                <button onClick={ handleInTheaters } className="actionBtn" >В кината</button>
                <button onClick={ handleRandom } className="actionBtn" >Рандъм</button>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={'dark'}
            />
            <i className="fas fa-cog"></i>
        </header>
    );
}

export default Header;