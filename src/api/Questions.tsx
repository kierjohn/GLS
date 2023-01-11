import api from 'api'
import { CancelTokenSource } from 'axios'
import { getHeaders } from 'utils/helpers'

export type QuestionProps = {
	id: string
	category: string
	checklist: string
	createdBy: string
	example: string
	language: string
	maxPoints: number
	order: number
	question: string
	status: number
}
export const getQuestions = ({
	source,
	checklist
}: {
	source: CancelTokenSource
	checklist?: string
}) => {
	return api.get('/question/list/all/v2', {
		headers: getHeaders(),
		cancelToken: source.token,
		params: {
			checklist
		}
	})
}

export const createQuestion = ({
	category,
	checklist,
	createdBy,
	example,
	language,
	maxPoints,
	order,
	question,
	status
}: Partial<QuestionProps>) => {
	return api.post('/question/add', {
		category,
		checklist,
		created_by: createdBy,
		example,
		language,
		max_points: maxPoints,
		order,
		question,
		status,
		headers: getHeaders()
	})
}

export const removeQuestion = ({ id }: Partial<QuestionProps>) => {
	return api.delete(`/question/${id}`, {
		headers: getHeaders()
	})
}

export const updateQuestion = ({
	id,
	category,
	checklist,
	createdBy,
	example,
	language,
	maxPoints,
	order,
	question,
	status
}: Partial<QuestionProps>) => {
	return api.put(`/question/${id}`, {
		category,
		checklist,
		created_by: createdBy,
		example,
		language,
		max_points: maxPoints,
		order,
		question,
		status,
		headers: getHeaders()
	})
}

export const getQuestion = ({
	id,
	source
}: Partial<QuestionProps> & { source: CancelTokenSource }) => {
	return api.get(`/question/${id}`, {
		cancelToken: source.token,
		headers: getHeaders()
	})
}
