import './Footer.css';

import {
    useContext,
    useEffect,
    useState,
} from 'react';

import { SearchContext } from '../../contexts/Search/provider';
import SystemInfo from '../SystemInfo/SystemInfo';

function Footer() {
    const maxLength = 5;
    const [ state, dispatch ] = useContext(SearchContext);
    const [ hideLeft, setHideLeft ] = useState(true);
    const [ hideRight, setHideRight ] = useState(false);
    const [ pagesCount, setPagesCount ] = useState(0);
    const [ pageIndex, setPageIndex ] = useState(1);
    const [ pageArray, setPageArray ] = useState([1, 2, 3, 4]);
    
    const firstPage = e => {
        let newPageArray = [...new Array(maxLength - 1).keys()].map(i => i + 1);
        setPageArray(newPageArray);
        setPageIndex(1);
        dispatch({ type: 'set_page', data: { index:0, from: 'footer', max: pagesCount } });
    };

    const lastPage = e => {
        let newPageArray = [...new Array(maxLength - 1).keys()];
        for(let i = maxLength - 2, j = 0; i >= 0; i--, j++)
        newPageArray[i] = pagesCount - j;
        setPageArray(newPageArray);
        setPageIndex(maxLength - 1);
        dispatch({ type: 'set_page', data: { index:pagesCount - 1, from: 'footer', max: pagesCount }});
    }

    const handleClick = i => {
        setPageIndex(i);
        dispatch({ type: 'set_page', data: { index:pageArray[i - 1] - 1, from: 'footer', max: pagesCount }});
        
        if(pagesCount <= maxLength) return;

        // if middle then return
        if(i > 1 && i < pageArray.length) return;        
        // shift to the right (max 2)
        if(i === pageArray.length){
            let last = pageArray[pageArray.length - 1];
            let diff = pagesCount - last;

            if(last === pagesCount) return;

            if(diff < 2) {
                setPageArray(pageArray.map(i => i + diff));
                setPageIndex(2 + diff);
                return;
            }
            setPageArray(pageArray.map(i => i + 2));
            setPageIndex(2);
        }
        // shift to the left (max 2)
        if(i === 1) {
            if(pageArray[0] <= 1) return;

            let first = pageArray[0];
            let diff = first - 1;

            if(diff < 2) {
                setPageArray(pageArray.map(i => i - diff));
                setPageIndex(maxLength - 2 - diff);
                return;
            }

            setPageArray(pageArray.map(i => i - 2));
            setPageIndex(maxLength - 2);
        }
    }

    // set first page
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => pagesCount > 0 ? firstPage() : null ,[pagesCount]);

    // on mount and state change
    useEffect(() => {
        let count = state.data.length;
        setPagesCount(Math.max(count / 10, 1));

        if(count <= maxLength) setPageArray([...new Array(count).keys()]);
        else setPageArray([...new Array(maxLength - 1).keys()].map(i => i+1));
    }, [state.data]);

    // update the pages if page index changed from elsewhere
    useEffect(() => {
        if(state.from === '') return;
        if(state.from !== 'footer'){
            let increment = state.pageIndex - 2;
            
            // edge case for right value
            if(state.pageIndex >= pagesCount - 1)
            increment = state.pageIndex - 2 - Math.abs((pagesCount - 1) - state.pageIndex);

            // edge case for left value
            if(state.pageIndex <= 2)
            increment = state.pageIndex - 1 + Math.abs(2 - state.pageIndex);

            // compute new array filled with page range
            let newArray = [...new Array(maxLength - 1).keys()];
            newArray = newArray.map(i => i + increment);
            
            setPageIndex(Math.max(1, newArray.indexOf(state.pageIndex) + 1));
            setPageArray(newArray);
        }
    }, [state.pageIndex, state.from, pagesCount]);

    // add the left and right buttons if needed
    useEffect(() => {
        setHideLeft(pageArray.indexOf(1) !== -1);
        setHideRight(pageArray.indexOf(pagesCount) !== -1);
    },[pageArray, pagesCount])

    return (
        <div className="footer">
            <ul className="page-indexer">
                {
                    pagesCount <= maxLength ? (<>
                        {[...new Array(pagesCount).keys()].map((i) => 
                            <li key={i+1} 
                                className={ pageIndex === i+1 ? 'selected' : '' }
                                onClick={ () => handleClick(i+1) }
                            ><span>{i+1}</span></li>)}
                        </>) : (<>
                        {
                            !hideLeft && (<>
                                <li onClick={ () => firstPage() } ><span>1</span></li> 
                                <li className="dots"><div></div><div></div><div></div></li>
                            </>)
                        }
                        <li className={ pageIndex === 1 ? 'selected' : '' }
                            onClick={ () => handleClick(1) }
                        ><span>{pageArray[0]}</span></li>
                        <li className={ pageIndex === 2 ? 'selected' : '' }
                            onClick={ () => handleClick(2) }
                        ><span>{pageArray[1]}</span></li>
                        <li className={ pageIndex === 3 ? 'selected' : '' }
                            onClick={ () => handleClick(3) }
                        ><span>{pageArray[2]}</span></li>
                        <li className={ pageIndex === 4 ? 'selected' : '' }
                            onClick={ () => handleClick(4) }
                        ><span>{pageArray[3]}</span></li>
                        {
                            !hideRight && (<>
                                <li className="dots"><div></div><div></div><div></div></li>
                                <li onClick={ () => lastPage() } ><span>{pagesCount}</span></li> 
                            </>)
                        }
                    </>)
                }
            </ul>
            <SystemInfo />
        </div>
    );
}

export default Footer;