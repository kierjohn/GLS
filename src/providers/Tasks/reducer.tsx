import { TasksStateProps, TaskActionProps, TaskActions } from './types'

const reducer = (state: TasksStateProps, action: TaskActionProps) => {
	switch (action.type) {
		case TaskActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}
		case TaskActions.update:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}
		case TaskActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		default:
			return state
	}
}

export default reducer
