import { getCounts } from 'api/Reports'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useReportsDispatch } from '.'
import { ReportActions, ReportCountsProps } from './types'

export const useFetchCount = () => {
	const [data, setData] = useState<ReportCountsProps>()
	const dispatch = useReportsDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				dispatch({ type: ReportActions.updateLoading, payload: true })
				const {
					data: { data }
				} = await getCounts({ source })

				const formattedCounts = {
					audit: Number(data.audit),
					area: Number(data.area),
					location: Number(data.location)
				}

				setData(formattedCounts)
				dispatch({
					type: ReportActions.fetchCounts,
					payload: formattedCounts
				})
				dispatch({ type: ReportActions.updateLoading, payload: false })
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error(err)
					dispatch({ type: ReportActions.updateLoading, payload: false })
				}
			}
		}

		fetch()

		return () => {
			source.cancel()
		}
	}, [])
	/* eslint-enable */

	return [data, setData]
}
