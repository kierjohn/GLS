import axios, { AxiosError, AxiosResponse } from 'axios'
import { getHeaders } from 'utils/helpers'

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: getHeaders()
})

export const publicAPI = axios.create({
	baseURL: process.env.REACT_APP_API_URL
})

export const wordpressAPI = axios.create({
	baseURL: process.env.REACT_APP_WORDPRESS_API_URL
})

export const wordpressCustomAPI = axios.create({
	baseURL: process.env.REACT_APP_WORDPRESS_custom_API_URL
})

export const revCatApi = axios.create({
	baseURL: process.env.REACT_APP_REV_CAT_URL
})

api.interceptors.response.use(
	(value: AxiosResponse) => {
		return value
	},
	(error: AxiosError<AxiosResponse<object>>) => {
		return error.response
	}
)

publicAPI.interceptors.response.use(
	(value: AxiosResponse) => {
		return value
	},
	(error: AxiosError<AxiosResponse<object>>) => {
		return error.response
	}
)

wordpressAPI.interceptors.response.use(
	(value: AxiosResponse) => {
		return value
	},
	(error: AxiosError<AxiosResponse<object>>) => {
		return error.response
	}
)

wordpressCustomAPI.interceptors.response.use(
	(value: AxiosResponse) => {
		return value
	},
	(error: AxiosError<AxiosResponse<object>>) => {
		return error.response
	}
)

revCatApi.interceptors.response.use(
	(value: AxiosResponse) => {
		return value
	},
	(error: AxiosError<AxiosResponse<object>>) => {
		return error.response
	}
)

export default api
