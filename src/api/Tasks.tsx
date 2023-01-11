import api from 'api'
import { CancelTokenSource } from 'axios'
import { getHeaders } from 'utils/helpers'

export const getTasks = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/task/list/all', {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getFilteredTasks = ({
	archived = false,
	areaId,
	limit,
	location,
	page,
	priority,
	search,
	source,
	userId
}: {
	archived: boolean
	areaId: string
	limit: number
	location: string
	page: number
	priority: string
	search: string
	source: CancelTokenSource
	userId?: string
}) => {
	return api.get('/task/list/filter/', {
		params: {
			archived,
			area: areaId,
			limit,
			location,
			priority,
			page,
			search,
			userId
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const updateTask = ({
	archived,
	audit,
	description,
	dueDate,
	id,
	priority,
	status,
	taskStatus,
	title
}: {
	archived: boolean
	audit: string
	description: string
	dueDate: Date
	id: string
	priority: string
	status: number
	taskStatus: string
	title: string
}) => {
	return api.put(`/task/${id}`, {
		archived,
		audit,
		description,
		due_date: dueDate,
		priority,
		status,
		task_status: taskStatus,
		task: title,
		headers: getHeaders()
	})
}
