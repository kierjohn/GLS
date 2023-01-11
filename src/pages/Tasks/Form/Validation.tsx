import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export type UseFormValidationProps = {
	initialErrors: InitialErrorType
}

type InitialErrorType = {
	title: string
}

type validateFieldProps = {
	field: string
	value: string
}

const useTaskValidation = ({ initialErrors }: UseFormValidationProps) => {
	const { t } = useTranslation('common')
	const [errors, setErrors] = useState<InitialErrorType>(initialErrors)

	const validateField = ({ field, value }: validateFieldProps): boolean => {
		switch (field) {
			case 'title':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						title: t('validations.notEmpty', { field: t('tasks.form.inputs.title') })
					}))
					return false
				} else {
					setErrors({ ...errors, title: '' })
					return true
				}
		}
		return true
	}

	const clearErrors = () => {
		setErrors(initialErrors)
	}

	return { errors, clearErrors, validateField }
}

export default useTaskValidation
