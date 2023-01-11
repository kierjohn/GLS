import { DateTime } from 'luxon'
import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { AuditActionProps, AuditsStateProps } from './types'

export const initialState: AuditsStateProps = {
	data: [],
	details: {
		createdAt: DateTime.now(),
		createdBy: {},
		id: '',
		status: 0,
		scores: [],
		checklist: {}
	},
	isLoading: true,
	count: 0
}

export const AuditsState = createContext<AuditsStateProps>(initialState)
export const AuditsDispatch = createContext<Dispatch<AuditActionProps>>(() => null)
export const useAuditsState = () => useContext(AuditsState)
export const useAuditsDispatch = () => useContext(AuditsDispatch)

export const AuditsProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<AuditsState.Provider value={state}>
			<AuditsDispatch.Provider value={dispatch}>{children}</AuditsDispatch.Provider>
		</AuditsState.Provider>
	)
}
