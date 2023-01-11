import { getLocations } from 'api/Locations'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatLocations } from 'utils/helpers'
import { useLocationsDispatch } from '.'
import { LocationProps, LocationsActions } from './types'

export const useFetchLocation = () => {
	const [data, setData] = useState<Array<LocationProps>>()
	const locationDispatch = useLocationsDispatch()

	/* eslint-disable */

	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				locationDispatch({ type: LocationsActions.updateLoading, payload: true })
				const {
					data: { data: locations }
				} = await getLocations({ source })
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

		fetch()
		return () => {
			source.cancel()
		}
	}, [])
	/* eslint-enable */

	return [data, setData]
}
