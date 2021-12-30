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

        if(value.trim() === '') {
            dispatch({ type: 'set_popular' })
            return;
        }

        // inform the app for the beggining of searching
        dispatch({ type: 'search_start' })

        // make the api call
        imdbFetch(`${baseUrl}/SearchMovie/$KEY/${value}`).then(res => {
            if(res.errorMessage.length > 0) toastError(res.errorMessage);
            const final = extractYears(res.results);
            dispatch({ type: 'search_end', data: final, error: res.errorMessage })
        }).catch(() => dispatch({ type: 'search_end', data: [], error: 'No Results' }))
    }

    // by default the api used returns
    // the movie's year in the description
    // instead of a seperate object property
    const extractYears = results => results.map(r => { return { ...r, year: r.description.match(/([0-9]+)/)[0]} })

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