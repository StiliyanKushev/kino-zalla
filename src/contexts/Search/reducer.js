export const reducer = (state, action) => {
    switch (action.type) {
        case "set_page": {
            return {
                ...state,
                pageIndex: action.data.index,
                from: action.data.from,
                maxPages: action.data.max || state.maxPages
            }
        }

        case 'recomend-init' : {
            return {
                ...state,
                recomendInitialized: true,
            }
        }

        case 'set_popular': {
            return {
                ...state,
                data: state.popularSaved,
            }
        }

        case "save_data":{
            return {
                ...state,
                data: action.data,
            }
        }

        case "search_start":{
            return {
                ...state,
                searching: true,
                data: [],
                error: '',
            }
        }
        
        case "search_end": {
            return {
                ...state,
                searching: false,
                data: action.data,
                error: action.error,
            }
        }

        case "set_popup": {
            return {
                ...state,
                popupLink: action.data,
            }
        }

        case "set_title": {
            return {
                ...state,
                currentFilmName: action.data
            }
        }

        case "save_recomended": {
            return {
                ...state,
                recomended: action.data,
            }
        }

        case "save_popular": {
            return {
                ...state,
                popularSaved: action.data
            }
        }

        case "load_popular": {
            return {
                ...state,
                data: state.popularSaved,
            }
        }
    
        case "save_top": {
            return {
                ...state,
                topSaved: action.data
            }
        }

        case "load_top": {
            return {
                ...state,
                data: state.topSaved,
            }
        }

        case "save_theaters": {
            return {
                ...state,
                inTheatersSaved: action.data
            }
        }

        case "load_theaters": {
            return {
                ...state,
                data: state.inTheatersSaved,
            }
        }

        default: return state
    }
}
  
export const initialState = {
    recomendInitialized: false,
    popupLink: '',
    searching: false,
    data: [],
    popularSaved: [],
    topSaved: [],
    inTheatersSaved: [],
    recomended: [],
    currentFilmName: '',
    error: '',
    pageIndex: 0,
    maxPages: 0,
    from: '',
}