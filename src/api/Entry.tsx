import { publicAPI } from 'api'

export type RegisterType = {
	email: string
	password: string
}

export const register = ({ email, password }: RegisterType) => {
	return publicAPI.post('/user/register', { email, password })
}

export type LoginType = {
	password: string
	username: string
}

export const login = ({ password, username }: LoginType) => {
	return publicAPI.post('/user/login', { password, username })
}
