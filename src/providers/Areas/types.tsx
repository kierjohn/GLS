import { LocationProps } from 'providers/Locations/types'
import { UserProps } from 'providers/Users/types'

export enum AreaActions {
	add = 'ADD',
	fetch = 'FETCH',
	remove = 'REMOVE',
	update = 'UPDATE',
	updateLoading = 'UPDATE_LOADING',
	updateCount = 'UPDATE_COUNT'
}

export type AreaActionProps =
	| { type: AreaActions.add; payload: AreaProps }
	| { type: AreaActions.fetch; payload: Array<AreaProps> }
	| { type: AreaActions.remove; payload: string }
	| { type: AreaActions.update; payload: AreaProps }
	| { type: AreaActions.updateLoading; payload: boolean }
	| { type: AreaActions.updateCount; payload: number }

export type AreaProps = {
	createdAt: string
	createdBy: Partial<UserProps>
	description: string
	id: string
	image: string
	location?: Partial<LocationProps>
	locationId?: string
	status: number
	title: string
	type: string
}

export type AreasStateProps = {
	data: Array<AreaProps>
	isLoading: boolean
	count: number
}
