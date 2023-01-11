import { ActivitiesStateProps, ActivityActionProps, ActivityActions } from './types'

const reducer = (state: ActivitiesStateProps, action: ActivityActionProps) => {
	switch (action.type) {
		case ActivityActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}
		case ActivityActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}
		case ActivityActions.updateCount:
			return {
				...state,
				count: action.payload
			}

		default:
			return state
	}
}

export default reducer
