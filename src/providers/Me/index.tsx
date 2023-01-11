import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import { reducer } from './reducer'
import { MeActionProps } from './types'
import { UserProps } from 'providers/Users/types'

export const initialMeState: UserProps = {
	acceptCookies: false,
	email: '',
	firstname: '',
	id: '',
	isLoading: true,
	isLoggedIn: true,
	language: 'en',
	lastname: '',
	role: 0,
	status: '1',
	targetScore: 75,
	taskOrder: [],
	tester: false,
	theme: 'light',
	username: '',
	verified: false,
	createdAt: new Date(),
	is6s: false,
	issues: false,
	userToken: '',
	userTokenExpires: new Date()
}

export const MeState = createContext<UserProps>(initialMeState)
export const MeDispatch = createContext<Dispatch<MeActionProps>>(() => null)
export const useMeState = () => useContext(MeState)
export const useMeDispatch = () => useContext(MeDispatch)

export const MeProvider: FC = ({ children }) => {
	const [userState, userDispatch] = useReducer(
		reducer,
		initialMeState,
		() => initialMeState
	)

	return (
		<MeState.Provider value={userState}>
			<MeDispatch.Provider value={userDispatch}>{children}</MeDispatch.Provider>
		</MeState.Provider>
	)
}
