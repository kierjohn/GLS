import { getProfile } from 'api/Profile'
import axios from 'axios'
import Cookie from 'js-cookie'
import { UserProps } from 'providers/Users/types'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { formatUser } from 'utils/helpers'
import { initialMeState, useMeDispatch } from '.'
import { MeActions } from './types'

export const useFetchMe = (): {
	data: UserProps
	setData: Dispatch<SetStateAction<UserProps>>
} => {
	const [data, setData] = useState<UserProps>(initialMeState)
	const dispatch = useMeDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				dispatch({ type: MeActions.updateLoading, payload: true })
				const { data } = await getProfile({ source })
				const { data: me } = data

				if (me.error) {
					dispatch({ type: MeActions.updateLoggedInStatus, payload: false })
				} else {
					const formattedMe = formatUser({ ...me, isLoggedIn: true })
					setData(formattedMe)
					dispatch({
						type: MeActions.fetch,
						payload: formattedMe
					})

					Cookie.set('lng', formattedMe.language)
					Cookie.set('thm', formattedMe.theme)
					return
				}

				dispatch({ type: MeActions.updateLoading, payload: false })
				dispatch({ type: MeActions.updateLoggedInStatus, payload: false })
			} catch (err) {
				if (!axios.isCancel(err)) {
					dispatch({ type: MeActions.updateLoggedInStatus, payload: false })
					dispatch({ type: MeActions.updateLoading, payload: false })
					console.error(err)
				}
			}
			dispatch({ type: MeActions.updateLoading, payload: false })
		}

		fetch()
		return () => {
			source.cancel()
		}
	}, [])
	/* eslint-enable */

	return { data, setData }
}
