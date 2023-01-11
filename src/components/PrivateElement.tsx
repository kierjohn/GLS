import jwt_decode from 'jwt-decode'
import { isNil } from 'lodash'
import React, { FC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export type TokenType = {
	exp: number
	iat: number
	id: string
	role: number
}

const PrivateElement: FC = ({ children }) => {
	const location = useLocation()
	const token = localStorage.getItem('token') as string

	if (isNil(token)) {
		return <Navigate to={`/login?redirect=${location.pathname}`} />
	}

	try {
		const tokenDecoded = jwt_decode<TokenType>(token)
		const isLoggedIn = tokenDecoded?.id

		return isLoggedIn ? <>{children}</> : <Navigate to='/login' />
	} catch (error) {
		console.error(error)
		localStorage.removeItem('token')
		return <Navigate to='/login' />
	}
}

export default PrivateElement
