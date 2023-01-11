import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { ActivityActionProps, ActivitiesStateProps } from './types'

export const initialState: ActivitiesStateProps = {
	count: 0,
	data: [],
	isLoading: true,
}

export const ActivitiesState = createContext<ActivitiesStateProps>(initialState)
export const ActivitiesDispatch = createContext<Dispatch<ActivityActionProps>>(() => null)
export const useActivitiesState = () => useContext(ActivitiesState)
export const useActivitiesDispatch = () => useContext(ActivitiesDispatch)

export const ActivitiesProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<ActivitiesState.Provider value={state}>
			<ActivitiesDispatch.Provider value={dispatch}>
				{children}
			</ActivitiesDispatch.Provider>
		</ActivitiesState.Provider>
	)
}
