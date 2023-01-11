import api from 'api'
import { CancelTokenSource } from 'axios'
import { LocationProps } from 'providers/Locations/types'
import { getHeaders } from 'utils/helpers'

export const getLocations = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/location/list/all', {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export type getFiltedLocationsProps = {
	limit: number
	page: number
	source: CancelTokenSource
	sort?: string
	order?: string
	search?: string
}

export const getFilteredLocations = ({
	limit,
	page,
	sort = 'createdAt',
	order = 'desc',
	search = '',
	source
}: getFiltedLocationsProps) => {
	return api.get('/location/list/filter', {
		params: {
			limit,
			page,
			sort,
			order,
			search
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getLocation = ({
	id,
	source
}: Partial<LocationProps> & { source: CancelTokenSource }) => {
	return api.get(`/location/${id}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const createLocation = ({ description, name }: Partial<LocationProps>) => {
	return api.post('/location/add', {
		description,
		name,
		headers: getHeaders()
	})
}

export const removeLocation = ({ id }: Partial<LocationProps>) => {
	return api.delete(`/location/${id}`, {
		headers: getHeaders()
	})
}

export const updateLocation = ({ description, id, name }: Partial<LocationProps>) => {
	return api.put(`/location/${id}`, {
		description,
		name,
		headers: getHeaders()
	})
}
