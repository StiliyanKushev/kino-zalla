import './MainContent.css';

import {
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';

import loadingAsset from '../../assets/loading.gif';
import {
    backendBaseUrl,
    baseUrl,
    imdbFetch,
} from '../../config';
import { SearchContext } from '../../contexts/Search/provider';
import Film from '../../shared/Film/Film';
import Footer from '../Footer/Footer';

function MainContent() {
    const pageFilmsCount = 10;
    const [ state, dispatch ] = useContext(SearchContext);
    const [ pageItems, setPageItems ] = useState([]);
    const [ elements, setElements ] = useState([]);

    const appendLocalServerData = async items => {
        // get a list with all the names
        let titles = [];
        for(let item of items)
        if(item !== undefined)
        titles.push(item.title);
        // look for starred films and update 'items'
        let results = await axios.get(`${backendBaseUrl}/film/getStarred`, { params: { titles } })
        let starredFilms = results.data.data;
        starredFilms = starredFilms.map(e => e.title);
        for(let item of items)
        if(item !== undefined && starredFilms.includes(item.title))
        item.starred = true;
        return items;
    }

    // on mount
    useEffect(() => {
        // get popular movies at start
        imdbFetch(`${baseUrl}/MostPopularMovies/$KEY`).then(res => {
            dispatch({ type: 'save_data', data: res.items });
        }).catch(() => {})
    }, [dispatch]);

    // load page data
    useEffect(() => {
        if(!state.data[(state.pageIndex * pageFilmsCount)]) return; // data hasn't loaded yet
        
        let items = [];
        for(let i = 0; i < pageFilmsCount; i++)
        items.push(state.data[(state.pageIndex * pageFilmsCount) + i]);
        
        // add local data to imdb
        if(!state.local)
        (async items => setPageItems(await appendLocalServerData(items)))(items);
    }, [state.data, state.pageIndex, dispatch, state.local])


    // dynamically generate the rows based on page index
    useEffect(() => {
        // items are not loaded
        if(!pageItems[0]) return;

        let topItems = [];
        let bottomItems = [];
        pageItems.forEach((value, index) => {
            let filmElement = 
            <Film 
                key={ index }
                data={ value || {} }
            />
            // first row
            if(index < 5) topItems.push(filmElement);
            // second row
            else bottomItems.push(filmElement);
        });
        let newElements = [];
        newElements.push(<div key='1' className="row">{ topItems }</div>);
        newElements.push(<div key='2' className="row">{ bottomItems }</div>);

        setElements(newElements);
    }, [pageItems])

    return (
        <div className={`main-content ${state.searching ? 'response' : ''}`}>
            {
                state.searching && (<>
                    <div className="response-box">
                        <img src={ loadingAsset } alt='' />
                    </div>
                </>)
            }
            <div className="films-holder">
                {
                    !state.searching ? (<>{ elements }</>) : (<>
                        <div className="row">
                            <Film data={{}} />
                        </div>
                        <div className="row">
                            <Film data={{}} />
                        </div>
                    </>)
                }
            </div>
            <Footer />
        </div>
    );
}

export default memo(MainContent);