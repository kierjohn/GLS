import api from 'api'
import { publicAPI } from 'api'
import { CancelTokenSource } from 'axios'
import { UserProps } from 'providers/Users/types'
import { getHeaders } from 'utils/helpers'

export const getUser = ({ id, source }: { id: string; source: CancelTokenSource }) => {
	return api.get(`/user/${id}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export type GetFilteredUsersType = {
	limit: number
	order?: string
	page: number
	search?: string
	sort?: string
	source: CancelTokenSource
	verified?: string
	issues?: string
	role?: number | string
}

export const getFilteredUsers = ({
	limit,
	order,
	page,
	role,
	search,
	sort,
	verified,
	issues,
	source
}: GetFilteredUsersType) => {
	return api.get(`/user/list/filter`, {
		params: {
			limit,
			order,
			page,
			role,
			search,
			sort,
			verified,
			issues,
			source
		},
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const getUsers = ({ source }: { source: CancelTokenSource }) => {
	return api.get(`/user/list/all`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const createUser = ({
	acceptCookies,
	email,
	firstname,
	id,
	language,
	lastname,
	password,
	role,
	verified,
	targetScore,
	taskOrder,
	theme,
	username
}: Partial<UserProps>) => {
	return api.post('/user/add', {
		accept_cookies: acceptCookies,
		email,
		first_name: firstname,
		id,
		language,
		last_name: lastname,
		password,
		role,
		verified,
		target_score: targetScore,
		task_order: taskOrder,
		theme,
		username,
		headers: getHeaders()
	})
}

export const removeUser = ({ id }: Partial<UserProps>) => {
	return api.delete(`/user/${id}`, {
		headers: getHeaders()
	})
}

export const updateUser = ({
	acceptCookies,
	email,
	firstname,
	id,
	language,
	lastname,
	password,
	role,
	issues,
	targetScore,
	taskOrder,
	tester,
	theme,
	username,
	verified
}: Partial<UserProps>) => {
	return api.put(`/user/${id}`, {
		accept_cookies: acceptCookies,
		email,
		first_name: firstname,
		id,
		language,
		last_name: lastname,
		new_password: password,
		role,
		issues,
		target_score: targetScore,
		task_order: taskOrder,
		tester,
		theme,
		username,
		verified,
		headers: getHeaders()
	})
}

export const sendEmailVerification = ({
	email,
	source
}: {
	email: string
	source: CancelTokenSource
}) => {
	return api.post(`/user/send-verification`, {
		cancelToken: source.token,
		headers: getHeaders(),
		email
	})
}

export const sendResetPassword = ({
	email,
	source
}: {
	email: string
	source: CancelTokenSource
}) => {
	return publicAPI.post('/user/forget-password', {
		cancelToken: source.token,
		headers: getHeaders(),
		email
	})
}

export const verifyEmail = ({
	token,
	source
}: {
	token: string
	source: CancelTokenSource
}) => {
	return publicAPI.post(`/user/verify-account/${token}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const validateToken = ({
	token,
	source
}: {
	token: string
	source: CancelTokenSource
}) => {
	return publicAPI.get(`/user/validate-token/${token}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const resetPassword = ({
	password,
	source,
	token
}: {
	password: string
	source: CancelTokenSource
	token: string
}) => {
	return publicAPI.post(`/user/reset-password/${token}`, {
		cancelToken: source.token,
		headers: getHeaders(),
		password
	})
}

export const getUserReports = () => {
	return api.get(`/user/reports`, {
		headers: getHeaders()
	})
}
