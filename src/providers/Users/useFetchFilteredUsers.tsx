import { getFilteredUsers } from 'api/Users'
import axios, { CancelTokenSource } from 'axios'
import { useEffect, useState } from 'react'
import { formatUsers } from 'utils/helpers'
import { useUsersDispatch } from '.'
import { UserActions, UserProps } from './types'

export type UseFetchFilteredUsersType = {
	limit: number
	order?: string
	page: number
	search?: string
	sort?: string
	verified?: string
	issues?: string
	role?: number | string
}

export const useFetchFilteredUsers = ({
	limit,
	order = 'desc',
	page,
	role,
	search = '',
	sort = 'createdAt',
	issues,
	verified
}: UseFetchFilteredUsersType) => {
	const [data, setData] = useState<Array<UserProps>>()
	const dispatch = useUsersDispatch()

	/* eslint-disable */
	const fetch = async (source: CancelTokenSource, isSeach: boolean) => {
		try {
			dispatch({ type: UserActions.updateLoading, payload: true })
			const { data } = await getFilteredUsers({
				limit,
				order,
				page: isSeach ? 1 : page,
				role,
				search,
				sort,
				source,
				issues,
				verified
			})
			const {
				data: { data: users }
			} = data

			setData(formatUsers(users))
			dispatch({ type: UserActions.fetch, payload: formatUsers(users) })
			dispatch({ type: UserActions.updateCount, payload: Number(data.data.count) })
			dispatch({ type: UserActions.updateLoading, payload: false })
		} catch (err) {
			if (!axios.isCancel(err)) {
				console.error(err)
				dispatch({ type: UserActions.updateLoading, payload: false })
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
	}, [limit, order, page, role, sort, verified, issues])
	/* eslint-enable */

	return [data, setData]
}
