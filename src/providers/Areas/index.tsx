import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { AreaActionProps, AreasStateProps } from './types'

export const initialState: AreasStateProps = {
	data: [],
	isLoading: true,
	count: 0
}

export const AreasState = createContext<AreasStateProps>(initialState)
export const AreasDispatch = createContext<Dispatch<AreaActionProps>>(() => null)
export const useAreasState = () => useContext(AreasState)
export const useAreasDispatch = () => useContext(AreasDispatch)

export const AreasProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<AreasState.Provider value={state}>
			<AreasDispatch.Provider value={dispatch}>{children}</AreasDispatch.Provider>
		</AreasState.Provider>
	)
}
