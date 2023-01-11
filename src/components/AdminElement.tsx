import jwt_decode from 'jwt-decode'
import { isNil } from 'lodash'
import React, { FC } from 'react'
import { Navigate } from 'react-router-dom'

export type TokenType = {
	exp: number
	iat: number
	id: string
	role: number
}

const AdminElement: FC = ({ children }) => {
	const token = localStorage.getItem('token') as string

	if (isNil(token)) {
		return <Navigate to='/login' />
	}

	try {
		const tokenDecoded = jwt_decode<TokenType>(token)
		const isLoggedIn = tokenDecoded?.id

		return isLoggedIn && tokenDecoded.role === 1 ? <>{children}</> : <Navigate to='/' />
	} catch (error) {
		console.error(error)
		localStorage.removeItem('token')
		return <Navigate to='/login' />
	}
}

export default AdminElement
