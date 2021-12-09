export const reducer = (state, action) => {
    switch (action.type) {
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
        
        default:
            return state
    }
  }
  
  export const initialState = {
    searching: false,
    data: [],
    error: '',
    top: [],
    pageIndex: 0,
    filters: false,
  }