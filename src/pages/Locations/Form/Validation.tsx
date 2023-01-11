import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export type LocationErrorsType = {
	[name: string]: string
}

export type UseFormValidationProps = {
	initialErrors: LocationErrorsType
}

type validateFieldProps = {
	field: string
	value: string
}

const useLocationFormValidation = ({ initialErrors }: UseFormValidationProps) => {
	const { t } = useTranslation('common')
	const [errors, setErrors] = useState<LocationErrorsType>(initialErrors)

	const validateField = ({ field, value }: validateFieldProps): boolean => {
		switch (field) {
			case 'name':
				if (!Boolean(value.length)) {
					setErrors({
						...errors,
						name: t('validations.notEmpty', { field: t('locations.form.inputs.name') })
					})
					return false
				} else {
					setErrors({ ...errors, name: '' })
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

export default useLocationFormValidation
