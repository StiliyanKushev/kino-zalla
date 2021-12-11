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
    pageIndex: 0,
    maxPages: 0,
    from: '',
}