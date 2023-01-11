import { AuditActionProps, AuditActions, AuditsStateProps } from './types'

const reducer = (state: AuditsStateProps, action: AuditActionProps) => {
	switch (action.type) {
		case AuditActions.fetch:
			return {
				...state,
				data: action.payload,
				isLoading: false
			}
		case AuditActions.fetchDetails:
			return {
				...state,
				details: action.payload,
				isLoading: false
			}
		case AuditActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		case AuditActions.updateCount:
			return {
				...state,
				count: action.payload
			}

		default:
			return state
	}
}

export default reducer
