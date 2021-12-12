import {
    createContext,
    useReducer,
} from 'react';

import {
    initialState,
    reducer,
} from './reducer';

export const StreamContext = createContext({
  state: initialState,
  dispatch: () => null
})

export const StreamProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StreamContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </StreamContext.Provider>
  )
}