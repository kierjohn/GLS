import { getFilteredTasks } from 'api/Tasks'
import axios, { CancelTokenSource } from 'axios'
import { useEffect, useState } from 'react'
import { formatTasks } from 'utils/helpers'
import { useTasksDispatch } from '.'
import { TaskActions, TaskProps } from './types'

export type useFetchTasksType = {
	archived?: boolean
	search?: string
	areaId?: string
	location?: string
	priority?: string
	userId?: string
}

export const useFetchTasks = ({
	archived = false,
	search = '',
	areaId = '',
	location = '',
	priority = '',
	userId = ''
}: useFetchTasksType) => {
	const [data, setData] = useState<Array<TaskProps>>()
	const dispatch = useTasksDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()
		const delayDebounceFn = setTimeout(() => {
			fetch(source)
		}, 1000)

		return () => clearTimeout(delayDebounceFn)
	}, [search])

	useEffect(() => {
		const source = axios.CancelToken.source()

		fetch(source)

		return () => {
			source.cancel()
		}
	}, [archived, areaId, location, priority, userId])

	const fetch = async (source: CancelTokenSource) => {
		try {
			dispatch({ type: TaskActions.updateLoading, payload: true })
			const {
				data: {
					data: { data: tasks }
				}
			} = await getFilteredTasks({
				archived,
				areaId,
				limit: 0,
				location,
				page: 0,
				priority,
				search,
				source,
				userId
			})

			setData(formatTasks(tasks))
			dispatch({
				type: TaskActions.fetch,
				payload: formatTasks(tasks)
			})
			dispatch({ type: TaskActions.updateLoading, payload: false })
		} catch (err) {
			if (!axios.isCancel(err)) {
				console.error(err)
				dispatch({ type: TaskActions.updateLoading, payload: false })
			}
		}
	}
	/* eslint-enable */

	return [data, setData]
}
