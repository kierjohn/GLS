import { useCallback, useState } from 'react'

export type UserErrorsType = {
	email: string
	firstname: string
	language: string
	lastname: string
	role: string
	status: string
	targetScore: string
	taskOrder: string
	theme: string
	username: string
	verified: string
	password: string
}

export type UseFormValidationProps = {
	initialErrors: UserErrorsType
}

type validateFieldProps = {
	field: string
	value: string
}

const useUserFormValidation = ({ initialErrors }: UseFormValidationProps) => {
	const [errors, setErrors] = useState<UserErrorsType>(initialErrors)

	const validateField = ({ field, value }: validateFieldProps): boolean => {
		switch (field) {
			case 'email':
				break
		}

		return true
	}

	const clearErrors = useCallback(() => {
		setErrors(initialErrors)
	}, [initialErrors])

	return { errors, clearErrors, validateField }
}

export default useUserFormValidation
