import { getAreas } from 'api/Areas'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatAreas } from 'utils/helpers'
import { useAreasDispatch } from '.'
import { AreaActions, AreaProps } from './types'

export type userFetchAreaType = {
	userId?: string
}
export const useFetchArea = (props?: userFetchAreaType) => {
	const [data, setData] = useState<AreaProps[]>()
	const areaDispatch = useAreasDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				areaDispatch({ type: AreaActions.updateLoading, payload: true })
				const {
					data: { data: areas }
				} = await getAreas({ source, userId: props?.userId })

				setData(formatAreas(areas))
				areaDispatch({ type: AreaActions.fetch, payload: formatAreas(areas) })
				areaDispatch({ type: AreaActions.updateLoading, payload: false })
			} catch (err) {
				if (!axios.isCancel(err)) {
					console.error(err)
					areaDispatch({ type: AreaActions.updateLoading, payload: false })
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
