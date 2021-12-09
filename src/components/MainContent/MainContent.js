import './MainContent.css';

import {
    memo,
    useContext,
    useEffect,
} from 'react';

import loadingAsset from '../../assets/loading.gif';
import { SearchContext } from '../../contexts/Search/provider';
import dummy_top250 from '../../dummy_top250.json';
import Film from '../../shared/Film/Film';
import Footer from '../Footer/Footer';

function MainContent() {
    const [ state, dispatch ] = useContext(SearchContext);

    // on mount
    useEffect(() => {
        // get top 250 movies
        // fetch(`${baseUrl}/Top250Movies/${apiKey}`).then(res => res.json()).then(res => {
        //     console.log(res);
        // })

        console.log(dummy_top250);
        dispatch({ type: 'save_top', data: dummy_top250.items });
    }, [dispatch]);

    return (
        <div className={`main-content ${state.searching && 'response'}`}>
            {
                state.searching && (<>
                    <div className="response-box">
                        <img src={ loadingAsset } alt='' />
                    </div>
                </>)
            }
            <div className="films-holder">
                {
                    !state.searching ? (<>
                        <div className="row">
                            <Film/>
                            <Film/>
                            <Film/>
                            <Film/>
                            <Film/>
                        </div>
                        <div className="row">
                            <Film/>
                            <Film/>
                            <Film/>
                            <Film/>
                            <Film/>
                        </div>
                    </>) : (<>
                        <div className="row">
                            <Film url=''/>
                        </div>
                        <div className="row">
                            <Film url=''/>
                        </div>
                    </>)
                }
            </div>
            <Footer />
        </div>
    );
}

export default memo(MainContent);