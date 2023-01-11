import { getAllAudit } from 'api/Audits'
import axios from 'axios'
import { filter } from 'lodash'
import { useEffect, useState } from 'react'
import { formatAudits } from 'utils/helpers'
import { useAuditsDispatch } from '.'
import { AuditActions, AuditProps } from './types'

export type UseFetchAuditsProps = {
	standard: string
}
export const useFetchAudits = ({ standard }: UseFetchAuditsProps) => {
	const [data, setData] = useState<Array<AuditProps>>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const auditDispatch = useAuditsDispatch()

	/* eslint-disable */
	useEffect(() => {
		const source = axios.CancelToken.source()

		const fetch = async () => {
			setIsLoading(true)
			try {
				const {
					data: { data: audits }
				} = await getAllAudit({ source })

				const formattedAudit = formatAudits(
					//filter-out short audit
					filter(
						audits,
						(value) =>
							!value?.checklist?.is_short && value?.checklist?.standard === standard
					)
				)
				setData(formattedAudit)
				setIsLoading(false)
			} catch (err) {
				setIsLoading(false)
				if (!axios.isCancel(err)) {
					console.error(err)
					auditDispatch({ type: AuditActions.updateLoading, payload: false })
				}
			}
		}

		fetch()

		return () => {
			source.cancel()
		}
	}, [standard])
	/* eslint-enable */

	return { data, isLoading, setData }
}
