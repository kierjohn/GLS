import api from 'api'
import { CancelTokenSource } from 'axios'
import { getHeaders } from 'utils/helpers'

export const getCounts = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/report/list/counter', {
		cancelToken: source.token,
		headers: getHeaders()
	})
}
