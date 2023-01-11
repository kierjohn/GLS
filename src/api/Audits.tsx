import api from 'api'
import { CancelTokenSource } from 'axios'
import { getHeaders } from 'utils/helpers'

export const getFilteredAudit = ({
	areaId,
	limit = 20,
	page = 1,
	source,
	standard,
	userId,
	isShort = 'all'
}: {
	areaId?: string
	limit?: number
	page?: number
	source: CancelTokenSource
	standard?: string
	userId?: string
	isShort?: 'all' | 'full' | 'short'
}) => {
	return api.get('/audit/list/filter', {
		params: {
			page,
			limit,
			area: areaId,
			standard,
			userId,
			is_short: isShort,
			range: 12
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getAllAudit = ({ source }: { source: CancelTokenSource }) => {
	return api.get(`/audit/list/all?range=12`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getAudit = ({ id, source }: { id: string; source: CancelTokenSource }) => {
	return api.get(`/audit/${id}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}
