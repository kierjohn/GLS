export enum ReportActions {
	fetchCounts = 'FETCH_COUNTS',
	updateLoading = 'UPDATE_LOADING'
}

export type ReportActionProps =
	| { type: ReportActions.fetchCounts; payload: ReportCountsProps }
	| { type: ReportActions.updateLoading; payload: boolean }

export type ReportCountsProps = {
	audit: number
	area: number
	location: number
}

export type ReportsStateProps = {
	counts: ReportCountsProps
	isLoading: boolean
}
