export const reducer = (state, action) => {
    switch (action.type) {
        case "set_page": {
            console.log(action);
            return {
                ...state,
                pageIndex: action.data.index,
                from: action.data.from,
                maxPages: action.data.max || state.maxPages
            }
        }
        case "save_top":{
            return {
                ...state,
                top: action.data,
                filters: false,
            }
        }

        case "search_start":{
            return {
                ...state,
                searching: true,
                data: [],
                error: '',
                filters: true,
            }
        }
        case "search_end": {
            return {
                ...state,
                searching: false,
                data: action.data,
                error: action.error,
                filters: true,
            }
        }
        case "set_trailer": {
            return {
                ...state,
                trailerLink: action.data
            }
        }
        
        default: return state
    }
  }
  
export const initialState = {
    trailerLink: '',
    searching: false,
    data: [],
    error: '',
    top: [],
    pageIndex: 0,
    maxPages: 0,
    from: '',
    filters: false,
}