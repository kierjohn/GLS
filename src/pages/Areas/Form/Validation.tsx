import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type UseFormValidationProps = {
	initialErrors: InitialErrorType
}

type InitialErrorType = {
	image: string
	// location: string
	title: string
	type: string
}

type validateFieldProps = {
	field: string
	value: string
}

const useAreaFormValidation = ({ initialErrors }: UseFormValidationProps) => {
	const { t } = useTranslation('common')
	const [errors, setErrors] = useState<InitialErrorType>(initialErrors)

	const validateField = ({ field, value }: validateFieldProps): boolean => {
		switch (field) {
			case 'title':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						title: t('validations.notEmpty', { field: t('areas.form.inputs.title') })
					}))
					return false
				} else {
					setErrors({ ...errors, title: '' })
					return true
				}

			case 'type':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						type: t('validations.notEmpty', { field: t('areas.form.inputs.type') })
					}))
					return false
				} else {
					setErrors({ ...errors, type: '' })
					return true
				}

			// case 'location':
			// 	if (!Boolean(value.length)) {
			// 		setErrors((errors) => ({
			// 			...errors,
			// 			location: t('validations.notEmpty', {
			// 				field: t('areas.form.inputs.location')
			// 			})
			// 		}))
			// 		return false
			// 	} else {
			// 		setErrors({ ...errors, location: '' })
			// 		return true
			// 	}
			case 'image':
				if (!Boolean(value.length)) {
					setErrors((errors) => ({
						...errors,
						image: 'Please select an image'
					}))
					return false
				} else {
					setErrors({ ...errors, image: '' })
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
