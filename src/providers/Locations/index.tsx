import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { LocationsActionProps, LocationsStateProps } from './types'

export const initialState: LocationsStateProps = {
	data: [],
	isLoading: true,
	count: 0
}

export const LocationsState = createContext<LocationsStateProps>(initialState)
export const LocationsDispatch = createContext<Dispatch<LocationsActionProps>>(() => null)
export const useLocationsState = () => useContext(LocationsState)
export const useLocationsDispatch = () => useContext(LocationsDispatch)

export const LocationsProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<LocationsState.Provider value={state}>
			<LocationsDispatch.Provider value={dispatch}>{children}</LocationsDispatch.Provider>
		</LocationsState.Provider>
	)
}
