import { ReportsStateProps, ReportActionProps, ReportActions } from './types'

const reducer = (state: ReportsStateProps, action: ReportActionProps) => {
	switch (action.type) {
		case ReportActions.fetchCounts:
			return {
				...state,
				counts: action.payload,
				isLoading: false
			}
		case ReportActions.updateLoading:
			return {
				...state,
				isLoading: action.payload
			}

		default:
			return state
	}
}

export default reducer
