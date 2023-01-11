import { getFilteredActivities } from 'api/Activities'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatActivities } from 'utils/helpers'
import { useActivitiesDispatch } from '.'
import { ActivityActions, ActivityProps } from './types'

export const useFetchActivity = ({
	state,
	limit,
	page
}: {
	state?: Array<ActivityProps>
	limit: number
	page: number
}) => {
	const [data, setData] = useState<Array<ActivityProps>>()
	const ActivityDispatch = useActivitiesDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				ActivityDispatch({ type: ActivityActions.updateLoading, payload: true })
				const { data } = await getFilteredActivities({ source, limit, page })
				const {
					data: { data: activities }
				} = data

				ActivityDispatch({
					type: ActivityActions.updateCount,
					payload: data.data.count
				})

				if (state) {
					setData([...state, ...formatActivities(activities)])
					ActivityDispatch({
						type: ActivityActions.fetch,
						payload: [...state, ...formatActivities(activities)]
					})
				} else {
					setData(formatActivities(activities))
					ActivityDispatch({
						type: ActivityActions.fetch,
						payload: formatActivities(activities)
					})
				}
				ActivityDispatch({ type: ActivityActions.updateLoading, payload: false })
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error(err)
					ActivityDispatch({ type: ActivityActions.updateLoading, payload: false })
				}
			}
		}

		fetch()

		return () => {
			source.cancel()
		}
	}, [limit, page])
	/* eslint-enable */

	return [data, setData]
}
