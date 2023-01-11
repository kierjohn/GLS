import api from 'api'
import { CancelTokenSource } from 'axios'
import { AreaProps } from 'providers/Areas/types'
import { getHeaders } from 'utils/helpers'

export const getAreas = ({
	source,
	userId
}: {
	source: CancelTokenSource
	userId?: string
}) => {
	return api.get('/area/list/all', {
		params: {
			userId
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export type getFilteredAreasType = {
	limit: number
	order?: string
	page: number
	search?: string
	sort?: string
	source: CancelTokenSource
	type?: string
}
export const getFilteredAreas = ({
	limit,
	order,
	page,
	search,
	sort,
	source,
	type
}: getFilteredAreasType) => {
	return api.get('/area/list/filter', {
		params: {
			limit,
			order,
			page,
			search,
			sort,
			source,
			type
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const createArea = ({
	description,
	image,
	title,
	type,
	locationId
}: Partial<AreaProps>) => {
	return api.post('/area/add', {
		description,
		image,
		location: locationId,
		title,
		type,
		headers: getHeaders()
	})
}

export const removeArea = ({ id }: Partial<AreaProps>) => {
	return api.delete(`/area/${id}`, {
		headers: getHeaders()
	})
}

export const updateArea = ({
	id,
	image,
	description,
	title,
	type,
	locationId
}: Partial<AreaProps>) => {
	return api.put(`/area/${id}`, {
		description,
		image,
		location: locationId,
		title,
		type,
		headers: getHeaders()
	})
}

export const uploadAreaImage = (data: FormData) => {
	const token = localStorage.getItem('token') as string

	return api.post('area/upload/image', {
		headers: {
			'Accept': '*/*',
			'Content-Type': 'multipart/form-data',
			'x-access-token': token
		},
		data
	})
}
