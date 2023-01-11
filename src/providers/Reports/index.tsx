import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { ReportActionProps, ReportsStateProps } from './types'

export const initialState: ReportsStateProps = {
	counts: {
		audit: 0,
		area: 0,
		location: 0
	},
	isLoading: true
}

export const ReportsState = createContext<ReportsStateProps>(initialState)
export const ReportsDispatch = createContext<Dispatch<ReportActionProps>>(() => null)
export const useReportsState = () => useContext(ReportsState)
export const useReportsDispatch = () => useContext(ReportsDispatch)

export const ReportsProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<ReportsState.Provider value={state}>
			<ReportsDispatch.Provider value={dispatch}>{children}</ReportsDispatch.Provider>
		</ReportsState.Provider>
	)
}
