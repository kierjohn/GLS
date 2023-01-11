import { UserProps } from 'providers/Users/types'

export enum LocationsActions {
	add = 'ADD',
	fetch = 'FETCH',
	remove = 'REMOVE',
	update = 'UPDATE',
	updateCount = 'UPDATE_COUNT',
	updateLoading = 'UPDATE_LOADING'
}

export type LocationsActionProps =
	| { type: LocationsActions.add; payload: LocationProps }
	| { type: LocationsActions.fetch; payload: LocationProps[] }
	| { type: LocationsActions.remove; payload: string }
	| { type: LocationsActions.update; payload: LocationProps }
	| { type: LocationsActions.updateCount; payload: number }
	| { type: LocationsActions.updateLoading; payload: boolean }

export type LocationProps = {
	createdAt: string
	createdBy: Partial<UserProps>
	description: string
	id: string
	name: string
	status: number
}

export type LocationsStateProps = {
	data: Array<LocationProps>
	isLoading: boolean
	count: number
}
