import api from 'api'
import { CancelTokenSource } from 'axios'
import { UserProps } from 'providers/Users/types'
import { getHeaders } from 'utils/helpers'

export const getChecklists = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/checklist/list/all', {
		headers: getHeaders(),
		cancelToken: source.token
	})
}

export type ChecklistProps = {
	id: string
	code: string
	createdBy?: Partial<UserProps>
	language: string
	name: string
	isPublic: boolean
	isShort: boolean
	standard: string
	status: number
	version: string
	type: string
}

export const createChecklist = ({
	language,
	code,
	name,
	isPublic,
	isShort,
	status,
	standard,
	version,
	type
}: Partial<ChecklistProps>) => {
	return api.post('/checklist/add', {
		language,
		code,
		name,
		is_public: isPublic,
		is_short: isShort,
		standard,
		status,
		version,
		type,
		headers: getHeaders()
	})
}

export const removeChecklist = ({ id }: Partial<ChecklistProps>) => {
	return api.delete(`/checklist/${id}`, {
		headers: getHeaders()
	})
}

export const updateChecklist = ({
	id,
	language,
	code,
	name,
	isPublic,
	isShort,
	standard,
	status,
	version,
	type
}: Partial<ChecklistProps>) => {
	return api.put(`/checklist/${id}`, {
		language,
		code,
		name,
		is_public: isPublic,
		is_short: isShort,
		standard,
		status,
		version,
		type,
		headers: getHeaders()
	})
}

export const getChecklist = ({
	id,
	source
}: Partial<ChecklistProps> & { source: CancelTokenSource }) => {
	return api.get(`/checklist/${id}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}
