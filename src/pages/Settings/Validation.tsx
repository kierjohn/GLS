import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type UseFormValidationProps = {
	initialErrors: InitialErrorType
}

type InitialErrorType = {
	firstname: string
	lastname: string
	username: string
	email: string
	confirmEmail: string
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

type validateFieldProps = {
	field: string
	value: string
	testValue?: string
}

const useAreaFormValidation = ({ initialErrors }: UseFormValidationProps) => {
	const USERNAME_LENGTH_REGEX = /^(?=.{8,20}$).+$/
	const USERNAME_ALLOWED_CHARACTER_REGEX = /^[a-zA-Z0-9._]+$/
	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	const { t } = useTranslation('common')
	const [errors, setErrors] = useState<InitialErrorType>(initialErrors)

	const validateField = ({ field, value, testValue }: validateFieldProps): boolean => {
		switch (field) {
			case 'firstname':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						firstname: t('validations.notEmpty', {
							field: t('settings.personal.firstname')
						})
					}))
					return false
				} else {
					setErrors({ ...errors, firstname: '' })
					return true
				}
			case 'lastname':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						lastname: t('validations.notEmpty', {
							field: t('settings.personal.lastname')
						})
					}))
					return false
				} else {
					setErrors({ ...errors, lastname: '' })
					return true
				}
			case 'username':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						username: t('validations.notEmpty', {
							field: t('settings.account.username')
						})
					}))
					return false
				} else if (!USERNAME_LENGTH_REGEX.test(value)) {
					setErrors((errors) => ({
						...errors,
						username: t('validations.invalidUsernameLength')
					}))
					return false
				} else if (!USERNAME_ALLOWED_CHARACTER_REGEX.test(value)) {
					setErrors((errors) => ({
						...errors,
						username: t('validations.invalidUsernameCharacters')
					}))
					return false
				} else {
					setErrors({ ...errors, username: '' })
					return true
				}

			case 'email':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						email: t('validations.notEmpty', {
							field: t('settings.account.email')
						})
					}))
					return false
				} else if (!EMAIL_REGEX.test(value)) {
					setErrors((errors) => ({
						...errors,
						email: t('validations.invalidEmail')
					}))
					return false
				} else {
					setErrors({ ...errors, email: '' })
					return true
				}

			case 'confirmEmail':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						confirmEmail: t('validations.notEmpty', {
							field: t('settings.account.confirmEmail')
						})
					}))
					return false
				} else if (value !== testValue) {
					setErrors((errors) => ({
						...errors,
						confirmEmail: t('validations.didntMatch', {
							field: t('settings.account.email')
						})
					}))
					return false
				} else {
					setErrors({ ...errors, confirmEmail: '' })
					return true
				}
			case 'currentPassword':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						currentPassword: t('validations.notEmpty', {
							field: t('settings.password.current')
						})
					}))
					return false
				} else {
					setErrors({ ...errors, currentPassword: '' })
					return true
				}

			case 'newPassword':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						newPassword: t('validations.notEmpty', {
							field: t('settings.password.new')
						})
					}))
					return false
				} else if (value.length < 8) {
					setErrors((errors) => ({
						...errors,
						newPassword: t('validations.invalidPassword')
					}))
					return false
				} else {
					setErrors({ ...errors, newPassword: '' })
					return true
				}
			case 'confirmPassword':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						confirmPassword: t('validations.notEmpty', {
							field: t('settings.password.confirm')
						})
					}))
					return false
				} else if (value !== testValue) {
					setErrors((errors) => ({
						...errors,
						confirmPassword: t('validations.didntMatch', {
							field: t('settings.password.new')
						})
					}))
					return false
				} else {
					setErrors({ ...errors, confirmPassword: '' })
					return true
				}
		}
		return true
	}

	const clearErrors = useCallback(() => {
		setErrors(initialErrors)
	}, [initialErrors])

	return { errors, clearErrors, validateField }
}

export default useAreaFormValidation
