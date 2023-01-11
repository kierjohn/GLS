import { filter, map } from 'lodash'
import { LocationsActionProps, LocationsActions, LocationsStateProps } from './types'

const reducer = (state: LocationsStateProps, action: LocationsActionProps) => {
	switch (action.type) {
		case LocationsActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}

		case LocationsActions.add:
			return {
				...state,
				data: [action.payload, ...state.data],
				isLoading: false
			}

		case LocationsActions.remove:
			return {
				...state,
				data: filter(state.data, (value) => value?.id !== action.payload),
				isLoading: false
			}

		case LocationsActions.update:
			return {
				...state,
				data: map(state.data, (value) => {
					if (value?.id === action.payload.id) {
						return {
							...value,
							name: action.payload.name,
							description: action.payload.description
						}
					}

					return value
				}),
				isLoading: false
			}

		case LocationsActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		case LocationsActions.updateCount:
			return {
				...state,
				count: action.payload
			}

		default:
			return state
	}
}

export default reducer
