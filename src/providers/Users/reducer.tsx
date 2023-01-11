import { filter, map } from 'lodash'
import { UserActionProps, UserActions, UsersStateProps } from './types'

const reducer = (state: UsersStateProps, action: UserActionProps) => {
	switch (action.type) {
		case UserActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}

		case UserActions.add:
			return {
				...state,
				data: [action.payload, ...state.data],
				isLoading: false
			}

		case UserActions.remove:
			return {
				...state,
				data: filter(state.data, (value) => value?.id !== action.payload),
				isLoading: false
			}

		case UserActions.update:
			return {
				...state,
				data: map(state.data, (value) => {
					if (value?.id === action.payload.id) {
						return {
							...value,
							...action.payload
						}
					}

					return value
				}),
				isLoading: false
			}

		case UserActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}
		case UserActions.updateCount:
			return {
				...state,
				count: action.payload
			}
		default:
			return state
	}
}

export default reducer
