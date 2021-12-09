import './SearchBar.css';

import {
    useContext,
    useState,
} from 'react';

import { SearchContext } from '../../contexts/Search/provider';

function SearchBar() {
    const [ value, setValue ] = useState('');
    const dispatch = useContext(SearchContext)[1];

    const handleSearch = () => {
        // inform the app for the beggining of searching
        dispatch({ type: 'search_start' })

        // make the api call
        // todo
    }

    return (
        <form className="search">
            <input 
                type="text"
                placeholder="Търси филми..."
                value={ value } 
                onChange={ e => setValue(e.target.value) }
            />
            <i className="fas fa-search" onClick={handleSearch}></i>
        </form>
    );
}

export default SearchBar;