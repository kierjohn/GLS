import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import { updateProfile } from 'api/Profile'
import { Body, Footer, Header, Wrapper } from 'components/SettingsStyle'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { trim } from 'lodash'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import React, { FC, FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initialErrors } from '.'
import useAreaFormValidation from './Validation'

const Personal: FC = () => {
	const { t } = useTranslation('common')
	const data = useMeState()

	const toastDispatch = useToastDispatch()
	const dispatch = useMeDispatch()

	const { errors, validateField } = useAreaFormValidation({ initialErrors })

	const [firstname, setFirstname] = useState<string>(data.firstname)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [lastname, setLastname] = useState<string>(data.lastname)

	useEffect(() => {
		setFirstname(data.firstname)
		setLastname(data.lastname)
	}, [data.firstname, data.lastname])

	const updatePersonalInformation = async (e: FormEvent) => {
		e.preventDefault()

		const isFirstnameValid = validateField({ field: 'firstname', value: trim(firstname) })
		const isLastnameValid = validateField({ field: 'lastname', value: trim(lastname) })

		if (!isFirstnameValid || !isLastnameValid) {
			return
		}

		setIsLoading(true)

		try {
			const res = await updateProfile({
				...data,
				firstname: trim(firstname),
				lastname: trim(lastname)
			})

			if (res.data.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileError',
						text: t('settings.toast.error'),
						type: ToastTypes.danger
					}
				})
			} else {
				dispatch({
					type: MeActions.update,
					payload: {
						...data,
						firstname: trim(firstname),
						lastname: trim(lastname)
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileSuccess',
						text: t('settings.toast.update', { settings: t('settings.personal.title') }),
						type: ToastTypes.info
					}
				})
				setIsLoading(false)
			}
		} catch (error) {
			console.error('error', error)
			setIsLoading(false)
		}
	}

	return (
		<Wrapper>
			<form onSubmit={updatePersonalInformation}>
				<Header>
					<H as='h4'>{t('settings.personal.title')}</H>
				</Header>
				<Body>
					<Input
						error={errors.firstname}
						label={t('settings.personal.firstname')}
						type='text'
						value={firstname}
						onBlur={(e) => {
							validateField({ field: 'firstname', value: trim(e.currentTarget.value) })
						}}
						onChange={(e) => {
							validateField({ field: 'firstname', value: trim(e.currentTarget.value) })
							setFirstname(e.currentTarget.value)
						}}
					/>
					<Input
						error={errors.lastname}
						label={t('settings.personal.lastname')}
						type='text'
						value={lastname}
						onBlur={(e) => {
							validateField({ field: 'lastname', value: trim(e.currentTarget.value) })
						}}
						onChange={(e) => {
							validateField({ field: 'lastname', value: trim(e.currentTarget.value) })
							setLastname(e.currentTarget.value)
						}}
					/>
				</Body>
				<Footer>
					<Button type='submit' loading={isLoading}>
						<SaveIcon />
						{t('settings.save')}
					</Button>
				</Footer>
			</form>
		</Wrapper>
	)
}

export default Personal
