import { AreaProps } from 'providers/Areas/types'
import { LocationProps } from 'providers/Locations/types'
import { UserProps } from 'providers/Users/types'

export enum TaskActions {
	fetch = 'FETCH',
	update = 'UPDATE',
	updateLoading = 'UPDATE_LOADING'
}

export type TaskActionProps =
	| { type: TaskActions.fetch; payload: Array<TaskProps> }
	| { type: TaskActions.update; payload: Array<TaskProps> }
	| { type: TaskActions.updateLoading; payload: boolean }

export type TaskProps = {
	archived: boolean
	audit: string
	area: Partial<AreaProps>
	createdAt: Date
	createdBy: Partial<UserProps>
	description: string
	dueDate: Date
	id: string
	image: string
	location: Partial<LocationProps>
	priority: string
	status: number
	taskStatus: string
	title: string
}

export type TasksStateProps = {
	data: Array<TaskProps>
	isLoading: boolean
}
