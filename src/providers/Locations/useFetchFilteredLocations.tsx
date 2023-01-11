import { getFilteredLocations } from 'api/Locations'
import axios, { CancelTokenSource } from 'axios'
import { useEffect, useState } from 'react'
import { formatLocations } from 'utils/helpers'
import { useLocationsDispatch } from '.'
import { LocationProps, LocationsActions } from './types'

export type useFetchFilteredLocationsType = {
	page: number
	limit: number
	sort: string
	order: string
	search: string
}

export const useFetchFilteredLocations = ({
	page = 0,
	limit = 0,
	sort = 'createdAt',
	order = 'desc',
	search = ''
}: useFetchFilteredLocationsType) => {
	const [data, setData] = useState<Array<LocationProps>>()
	const locationDispatch = useLocationsDispatch()

	/* eslint-disable */
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
	}, [limit, page, sort, order])
	/* eslint-enable */

	const fetch = async (source: CancelTokenSource, isSeach: boolean) => {
		try {
			locationDispatch({ type: LocationsActions.updateLoading, payload: true })
			const { data } = await getFilteredLocations({
				limit,
				order,
				page: isSeach ? 1 : page,
				search,
				sort,
				source
			})
			const {
				data: { data: locations }
			} = data

			locationDispatch({
				type: LocationsActions.updateCount,
				payload: data.data.count
			})

			locationDispatch({
				type: LocationsActions.fetch,
				payload: formatLocations(locations)
			})

			locationDispatch({ type: LocationsActions.updateLoading, payload: false })
		} catch (err) {
			if (!axios.isCancel(err)) {
				console.error(err)
				locationDispatch({ type: LocationsActions.updateLoading, payload: false })
			}
		}
	}

	return [data, setData]
}
