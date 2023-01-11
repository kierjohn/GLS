import api from 'api'
import { CancelTokenSource } from 'axios'
import { getHeaders } from 'utils/helpers'

export const getActivities = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/activity/list/all', {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getFilteredActivities = ({
	limit,
	page,
	source
}: {
	limit: number
	page: number
	source: CancelTokenSource
}) => {
	return api.get('/activity/list/filter/', {
		params: {
			limit,
			page
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}
