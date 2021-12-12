export const reducer = (state, action) => {
    switch (action.type) {
        
        case "show_options": {
            return {
                ...state,
                visible: true,
                filmOptions: action.data,
            }
        }

        case "hide_options": {
            return {
                ...state,
                visible: false,
                filmOptions: [],
            }
        }

        default: return state
    }
}
  
export const initialState = {
    filmOptions: [],
    visible: false,
}