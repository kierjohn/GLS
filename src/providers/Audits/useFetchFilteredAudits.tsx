import { getFilteredAudit } from 'api/Audits'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatAudits } from 'utils/helpers'
import { useAuditsDispatch } from '.'
import { AuditActions, AuditProps } from './types'

export type FetchAreaProps = {
	areaId?: string
	limit?: number
	page?: number
	state?: Array<AuditProps>
	userId?: string
	standard?: string
	isShort: 'all' | 'full' | 'short'
}

export const useFetchFilteredAudits = ({
	areaId,
	limit,
	page,
	state,
	standard,
	userId,
	isShort
}: FetchAreaProps) => {
	const [data, setData] = useState<Array<AuditProps>>()
	const dispatch = useAuditsDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				dispatch({ type: AuditActions.updateLoading, payload: true })
				const { data } = await getFilteredAudit({
					areaId,
					limit,
					page,
					standard,
					source,
					userId,
					isShort
				})

				const {
					data: { data: audits }
				} = data

				if (state) {
					setData([...state, ...formatAudits(audits)])
					dispatch({
						type: AuditActions.fetch,
						payload: [...state, ...formatAudits(audits)]
					})
				} else {
					setData(formatAudits(audits))
					dispatch({
						type: AuditActions.fetch,
						payload: formatAudits(audits)
					})
				}

				dispatch({ type: AuditActions.updateLoading, payload: false })
				dispatch({ type: AuditActions.updateCount, payload: data.data.count })
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error(err)
					dispatch({ type: AuditActions.updateLoading, payload: false })
				}
			}
		}

		fetch()

		return () => {
			source.cancel()
		}
	}, [areaId, page, standard, userId])
	/* eslint-enable */

	return [data, setData]
}
