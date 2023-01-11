import { initialMeState } from '.'
import { MeActionProps, MeActions } from './types'
import { UserProps } from 'providers/Users/types'

export const reducer = (state: UserProps, action: MeActionProps) => {
	switch (action.type) {
		case MeActions.fetch:
			return action.payload

		case MeActions.update:
			return {
				...state,
				...action.payload
			}

		case MeActions.reset:
			return initialMeState

		case MeActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		case MeActions.updateLoggedInStatus:
			return {
				...state,
				isLoggedIn: action.payload
			}
	}
}
