import './SearchBar.css';

import {
    useContext,
    useState,
} from 'react';

import toastError, {
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';

function SearchBar() {
    const [ value, setValue ] = useState('');
    const dispatch = useContext(SearchContext)[1];

    const handleSearch = e => {
        e.preventDefault();

        // inform the app for the beggining of searching
        dispatch({ type: 'search_start' })

        // make the api call
        imdbFetch(`${baseUrl}/SearchMovie/$KEY/${value}`).then(res => {
            if(res.errorMessage.length > 0) toastError(res.errorMessage);
            dispatch({ type: 'search_end', data: res.results, error: res.errorMessage })
        }).catch(() => {})
    }

    return (
        <form className="search" onSubmit={ handleSearch }>
            <input 
                type="text"
                placeholder="Търси филми..."
                value={ value }
                onChange={ e => setValue(e.target.value) }
            />
            <i className="fas fa-search" onClick={ handleSearch }></i>
        </form>
    );
}

export default SearchBar;