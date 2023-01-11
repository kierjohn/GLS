import { getAudit } from 'api/Audits'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { formatAudit } from 'utils/helpers'
import { useAuditsDispatch } from '.'
import { AuditActions, AuditProps } from './types'

export type UseFetchAuditProps = {
	id: string
}

export const useFetchAudit = ({ id }: UseFetchAuditProps) => {
	const [data, setData] = useState<AuditProps>()
	const dispatch = useAuditsDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			try {
				dispatch({ type: AuditActions.updateLoading, payload: true })
				const { data } = await getAudit({ source, id })

				const { data: audit } = data

				setData(formatAudit(audit))
				dispatch({ type: AuditActions.fetchDetails, payload: formatAudit(audit) })
				dispatch({ type: AuditActions.updateLoading, payload: false })
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
	}, [id])
	/* eslint-enable */

	return [data, setData]
}
