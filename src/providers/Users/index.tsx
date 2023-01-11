import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { UserActionProps, UsersStateProps } from './types'

export const initialState: UsersStateProps = {
	data: [],
	isLoading: true,
	count: 0
}

export const UsersState = createContext<UsersStateProps>(initialState)
export const UsersDispatch = createContext<Dispatch<UserActionProps>>(() => null)
export const useUsersState = () => useContext(UsersState)
export const useUsersDispatch = () => useContext(UsersDispatch)

export const UsersProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<UsersState.Provider value={state}>
			<UsersDispatch.Provider value={dispatch}>{children}</UsersDispatch.Provider>
		</UsersState.Provider>
	)
}
