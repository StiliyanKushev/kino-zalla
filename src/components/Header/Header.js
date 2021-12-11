import './Header.css';
import 'react-toastify/dist/ReactToastify.css';

import {
    useContext,
    useState,
} from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';

import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';

function Header() {
    const [ state, dispatch ] = useContext(SearchContext);
    const [ popularLoading, setPopularLoading ] = useState(false);
    const [ favoriteLoading, setFavoriteLoading ] = useState(false);
    const [ topLoading, setTopLoading ] = useState(false);
    const [ theatersLoading, setTheatersLoading ] = useState(false);

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
        setPopularLoading(true);
        imdbFetch(`${baseUrl}/MostPopularMovies/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        }).catch(() => {  }).finally(() => { setPopularLoading(false) });
    }

    const handleTop250 = e => {
        e.preventDefault();
        setTopLoading(true);
        imdbFetch(`${baseUrl}/Top250Movies/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        }).catch(() => {}).finally(() => { setTopLoading(false) });
    }
    
    const handleInTheaters = e => {
        e.preventDefault();
        setTheatersLoading(true);
        imdbFetch(`${baseUrl}/InTheaters/$KEY`).then(res => {
            setFirstPage();
            dispatch({ type: 'save_data', data: res.items });
        }).catch(() => {}).finally(() => { setTheatersLoading(false) });
    }

    const handleFavorite = e => {
        e.preventDefault();
        setFavoriteLoading(true);
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
            setFavoriteLoading(false);
        })
    }

    return (
        <header>
            <select id="width_tmp_select"><option id="width_tmp_option"></option></select>
            <form>
                <button onClick={ handlePopular } className="actionBtn" >
                    Популярни
                    { popularLoading && <i class="fas fa-spinner fa-spin"></i> }
                </button>
                <button onClick={ handleFavorite } className="actionBtn" >
                    Любими
                    { favoriteLoading && <i class="fas fa-spinner fa-spin"></i> }
                </button>
                <button onClick={ handleTop250 } className="actionBtn" >
                    Топ 250
                    { topLoading && <i class="fas fa-spinner fa-spin"></i> }
                </button>
                <button onClick={ handleInTheaters } className="actionBtn" >
                    В кината
                    { theatersLoading && <i class="fas fa-spinner fa-spin"></i> }
                </button>
                <button onClick={ handleRandom } className="actionBtn" >
                    Рандъм
                </button>
            </form>
            <i className="fas fa-cog"></i>
        </header>
    );
}

export default Header;