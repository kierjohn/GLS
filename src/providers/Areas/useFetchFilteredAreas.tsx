import { getFilteredAreas } from 'api/Areas'
import axios, { CancelTokenSource } from 'axios'
import { useEffect, useState } from 'react'
import { formatAreas } from 'utils/helpers'
import { useAreasDispatch } from '.'
import { AreaActions, AreaProps } from './types'

export type useFetchFilteredAreasType = {
	limit: number
	order: string
	page: number
	search: string
	sort: string
	type: string
}

export const useFetchFilteredAreas = ({
	limit,
	order = 'desc',
	page,
	search = '',
	sort = 'createdAt',
	type = ''
}: useFetchFilteredAreasType) => {
	const [data, setData] = useState<AreaProps[]>()
	const areaDispatch = useAreasDispatch()

	/* eslint-disable */
	const fetch = async (source: CancelTokenSource, isSeach: boolean) => {
		try {
			areaDispatch({ type: AreaActions.updateLoading, payload: true })
			const { data } = await getFilteredAreas({
				limit,
				order,
				page,
				search,
				sort,
				source,
				type: type === 'all' ? undefined : type
			})
			const {
				data: { data: areas }
			} = data

			setData(formatAreas(areas))
			areaDispatch({ type: AreaActions.fetch, payload: formatAreas(areas) })
			areaDispatch({ type: AreaActions.updateCount, payload: data.data.count })
			areaDispatch({ type: AreaActions.updateLoading, payload: false })
		} catch (err) {
			if (!axios.isCancel(err)) {
				console.error(err)
				areaDispatch({ type: AreaActions.updateLoading, payload: false })
			}
		}
	}

	useEffect(() => {
		const source = axios.CancelToken.source()
		const delayDebounceFn = setTimeout(() => {
			fetch(source, true)
		}, 1000)

		return () => clearTimeout(delayDebounceFn)
	}, [search])

	useEffect(() => {
		const source = axios.CancelToken.source()
		fetch(source, false)

		return () => {
			source.cancel()
		}
	}, [limit, page, order, sort, type])
	/* eslint-enable */

	return [data, setData]
}
