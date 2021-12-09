import './Footer.css';

import {
    useContext,
    useEffect,
    useState,
} from 'react';

import { SearchContext } from '../../contexts/Search/provider';

function Footer(props) {
    const [ state, dispatch ] = useContext(SearchContext);
    const [ pagesCount, setPagesCount ] = useState(0);
    const [ pageIndex, setPageIndex ] = useState(1);
    
    useEffect(() => {
        if(!state.filters) setPagesCount(state.top.length);
        else setPagesCount(state.data.length);
    }, [state]);

    return (
        <div className="footer">
            <ul className="page-indexer">
                {
                    pagesCount <= 5 ? (<>
                        { [...new Array(pagesCount).keys()].map((i) => 
                        <li key={i+1} 
                            className={ pageIndex === i+1 && 'selected' }
                            onClick={ () => setPageIndex(i+1) }
                        ><span>{i+1}</span></li>) }
                    </>) : (<>
                        <li className={ pageIndex === 1 && 'selected' }
                            onClick={ () => setPageIndex(1) }
                        ><span>1</span></li>
                        <li className={ pageIndex === 2 && 'selected' }
                            onClick={ () => setPageIndex(2) }
                        ><span>2</span></li>
                        <li className={ pageIndex === 3 && 'selected' }
                            onClick={ () => setPageIndex(3) }
                        ><span>3</span></li>
                        <li className={ pageIndex === 4 && 'selected' }
                            onClick={ () => setPageIndex(4) }
                        ><span>4</span></li>
                        <li className="dots"><div></div><div></div><div></div></li>
                        <li><span>{pagesCount}</span></li>   
                    </>)
                }
            </ul>
            <p className="system-information">Intel Core i7 8700 80% 5.3GB/16GB 320GB/2TB 23h 15min</p>
        </div>
    );
}

export default Footer;