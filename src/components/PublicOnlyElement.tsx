import { isNil } from 'lodash'
import React, { FC } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

const PublicOnlyElement: FC = ({ children }) => {
	const token = localStorage.getItem('token') as string
	const [params] = useSearchParams()

	const redirect = params.get('redirect')

	if (isNil(token)) {
		return <>{children}</>
	}

	if (redirect) {
		return <Navigate to={`${redirect}`} />
	}
	return <Navigate to='/' />
}

export default PublicOnlyElement
