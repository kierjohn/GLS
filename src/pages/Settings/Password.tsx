import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import { updateProfile } from 'api/Profile'
import { Body, Footer, Header, Wrapper } from 'components/SettingsStyle'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { useMeState } from 'providers/Me'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import React, { FC, FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { initialErrors } from '.'
import useAreaFormValidation from './Validation'

const Password: FC = () => {
	const { t } = useTranslation('common')

	const data = useMeState()

	const toastDispatch = useToastDispatch()

	const { errors, validateField } = useAreaFormValidation({ initialErrors })

	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [currentPassword, setCurrentPassword] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [newPassword, setNewPassword] = useState<string>('')

	const updatePasssword = async (e: FormEvent) => {
		e.preventDefault()

		const isCurrentPasswordValid = validateField({
			field: 'currentPassword',
			value: currentPassword
		})
		const isNewPasswordValid = validateField({ field: 'newPassword', value: newPassword })
		const isConfirmPasswordValid = validateField({
			field: 'confirmPassword',
			value: confirmPassword,
			testValue: newPassword
		})

		if (!isCurrentPasswordValid || !isNewPasswordValid || !isConfirmPasswordValid) {
			return
		}

		setIsLoading(true)

		try {
			const res = await updateProfile({
				...data,
				currentPassword: currentPassword,
				newPassword: newPassword
			})

			if (res.data.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileError',
						text: res.data.message,
						type: ToastTypes.danger
					}
				})
			} else {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileSuccess',
						text: <>Profile has been updated</>,
						type: ToastTypes.info
					}
				})
				setIsLoading(false)
				setConfirmPassword('')
				setCurrentPassword('')
				setNewPassword('')
			}
			setIsLoading(false)
		} catch (error) {
			console.error('error', error)
			setIsLoading(false)
		}
	}

	return (
		<Wrapper>
			<form onSubmit={updatePasssword}>
				<Header>
					<H as='h4'>{t('settings.password.title')}</H>
				</Header>
				<Body>
					<Input
						error={errors.currentPassword}
						type='password'
						value={currentPassword}
						label={t('settings.password.current')}
						onBlur={(e) => {
							validateField({ field: 'currentPassword', value: e.currentTarget.value })
						}}
						onChange={(e) => {
							validateField({ field: 'currentPassword', value: e.currentTarget.value })
							setCurrentPassword(e.currentTarget.value)
						}}
					/>

					<H as='h5'>{t('settings.password.updatePassword')}</H>
					<Input
						error={errors.newPassword}
						type='password'
						value={newPassword}
						label={t('settings.password.new')}
						onBlur={(e) => {
							validateField({ field: 'newPassword', value: e.currentTarget.value })
						}}
						onChange={(e) => {
							validateField({ field: 'newPassword', value: e.currentTarget.value })
							setNewPassword(e.currentTarget.value)
						}}
					/>
					<Input
						error={errors.confirmPassword}
						type='password'
						value={confirmPassword}
						label={t('settings.password.confirm')}
						onBlur={(e) => {
							validateField({
								field: 'confirmPassword',
								testValue: newPassword,
								value: e.currentTarget.value
							})
						}}
						onChange={(e) => {
							validateField({
								field: 'confirmPassword',
								testValue: newPassword,
								value: e.currentTarget.value
							})
							setConfirmPassword(e.currentTarget.value)
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

export default Password
