import './MainContent.css';

import {
    memo,
    useContext,
    useEffect,
    useState,
} from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';

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

    const fetchThumbnails = async recomendations => {
        return await Promise.all(recomendations.map(async r => {
            try {
                let res = await imdbFetch(`${baseUrl}/Images/$KEY/${r.id}/Short`);
                let splited = res.items[0].image.split('.');
                splited[splited.length - 2] = '_V1_UX384_CR0';
                r.thumbnailUrl = splited.join('.');
            } catch { r.thumbnailUrl = '404 not found' }
            return r;
        }));
    }

    // on mount
    useEffect(() => {
        // get popular movies at start
        imdbFetch(`${baseUrl}/MostPopularMovies/$KEY`).then(async res => {
            let allItems = res.items;
            // spare the first 6 for the sidebar recomendations
            let recomendations = allItems.splice(0, 6);
            recomendations = await fetchThumbnails(recomendations);
            dispatch({ type: 'save_recomended', data: recomendations });
            dispatch({ type: 'save_data', data: allItems });
            dispatch({ type: 'save_popular', data: allItems });
        }).catch(async () => {
            // cannot connect to imdb api, use dummy data instead
            let popularItems = await (await import('../../dummy_mosPopular.json')).items;
            let topItems = await (await import('../../dummy_top250.json')).items;
            let recomendations = popularItems.splice(0, 6);
            dispatch({ type: 'save_recomended', data: recomendations });
            dispatch({ type: 'save_data', data: popularItems });
            dispatch({ type: 'save_popular', data: popularItems });
            dispatch({ type: 'save_top', data: topItems });
            toast.warn('Офлайн режимът е пуснат.', {
                position: "top-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });    
        })
    }, [dispatch]);

    // load page data
    useEffect(() => {
        // data hasn't loaded yet
        if(!state.data[(state.pageIndex * pageFilmsCount)] && state.searching) return;
        
        // if no results
        if(!state.data.length) return setPageItems([{}]);

        let items = [];
        for(let i = 0; i < pageFilmsCount; i++)
        items.push(state.data[(state.pageIndex * pageFilmsCount) + i]);

        // add local data to imdb
        if(!state.local)
        (async items => setPageItems(await appendLocalServerData(items)))(items);
    }, [state.data, state.pageIndex, dispatch, state.local, state.searching])


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