import { UserProps } from 'providers/Users/types'

export enum ActivityActions {
	fetch = 'FETCH',
	updateLoading = 'UPDATE_LOADING',
	updateCount = 'UPDATE_COUNT'
}

export type ActivityActionProps =
	| { type: ActivityActions.fetch; payload: ActivityProps[] }
	| { type: ActivityActions.updateLoading; payload: boolean }
	| { type: ActivityActions.updateCount; payload: number }

export type ActivityProps = {
	createdAt: string
	createdBy: Partial<UserProps>
	description: string
	id: string
	title: string
	type: string
}

export type ActivitiesStateProps = {
	data: Array<ActivityProps>
	isLoading: boolean
	count: number
}
