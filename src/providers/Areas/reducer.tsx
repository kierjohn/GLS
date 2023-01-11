import { filter, map } from 'lodash'
import { AreaActionProps, AreaActions, AreasStateProps } from './types'

const reducer = (state: AreasStateProps, action: AreaActionProps) => {
	switch (action.type) {
		case AreaActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}

		case AreaActions.add:
			return {
				...state,
				data: [action.payload, ...state.data],
				isLoading: false
			}

		case AreaActions.remove:
			return {
				...state,
				data: filter(state.data, (value) => value?.id !== action.payload),
				isLoading: false
			}

		case AreaActions.update:
			return {
				...state,
				data: map(state.data, (value) => {
					if (value?.id === action.payload.id) {
						return {
							...value,
							description: action.payload.description,
							image: action.payload.image,
							title: action.payload.title,
							type: action.payload.type,
							location: action.payload.location
						}
					}

					return value
				}),
				isLoading: false
			}

		case AreaActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		case AreaActions.updateCount:
			return {
				...state,
				count: action.payload
			}
		default:
			return state
	}
}

export default reducer
