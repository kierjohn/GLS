import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import Text from '@system/Text'
import { resetPassword, validateToken } from 'api/Users'
import axios from 'axios'
import Card from 'components/Card'
import { Form, FormWrapper, Header, MainWrapper } from 'components/EntryStyles'
import Loader from 'components/Loader'
import MainLayout from 'layout/MainLayout'
import { isEmpty } from 'lodash'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const UpdatePassword: FC = () => {
	const { t } = useTranslation('common')
	const [newPassword, setNewPassword] = useState<string>('')
	const [newPasswordError, setNewPasswordError] = useState<string>('')
	const [confirmPassword, setConfirmPassword] = useState<string>('')
	const [confirmPasswordError, setConfirmPasswordError] = useState<string>('')
	const [isTokenValid, setIsTokenValid] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isUpdatePasswordLoading, setIsUpdatePasswordLoading] = useState<boolean>(false)

	const toastDispatch = useToastDispatch()
	const navigate = useNavigate()
	const { token } = useParams()

	const updatePassword = async (e: FormEvent) => {
		e.preventDefault()

		setNewPasswordError('')
		setConfirmPasswordError('')

		if (isEmpty(newPassword)) {
			setNewPasswordError(
				t('validations.notEmpty', { field: t('updatePassword.inputs.newPassword') })
			)
			return
		}

		if (newPassword.length < 8) {
			setNewPasswordError(t('validations.invalidPassword'))
			return
		}

		if (isEmpty(confirmPassword)) {
			setConfirmPasswordError(
				t('validations.notEmpty', { field: t('updatePassword.inputs.confirmPassword') })
			)
			return
		}

		if (newPassword !== confirmPassword) {
			setConfirmPasswordError(
				t('validations.didntMatch', {
					field: t('entry.form.password')
				})
			)
			return
		}

		setIsUpdatePasswordLoading(true)
		const source = axios.CancelToken.source()

		try {
			await resetPassword({
				password: newPassword,
				source,
				token: `${token}`
			})
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'passwordUpdateSuccess',
					text: `Your account password has been updated. redirecting to login.`,
					type: ToastTypes.info
				}
			})
			setTimeout(() => {
				navigate('/login')
			}, 5000)
			setIsUpdatePasswordLoading(false)
		} catch (err) {
			setIsUpdatePasswordLoading(false)
			console.error(err)
		}
	}

	useEffect(() => {
		const verifyToken = async () => {
			setIsLoading(true)
			const source = axios.CancelToken.source()
			try {
				const result = await validateToken({ source, token: `${token}` })
				setIsTokenValid(result.data.isValid)
				setIsLoading(false)
			} catch (err) {
				setIsLoading(false)
				console.error(err)
			}
		}

		verifyToken()
	}, [token])

	if (isLoading) {
		return <Loader />
	}
	if (!isLoading && !isTokenValid) {
		return (
			<MainLayout>
				<MainWrapper>
					<Card>
						<Header>
							<H as='h3' weight='800'>
								{t('updatePassword.title')}
							</H>
						</Header>
						<FormWrapper>
							<TextWrapper>
								<Text size='medium'>{t('updatePassword.invalid.text')}</Text>
							</TextWrapper>
							<Button isBlocked to='/forgot-password'>
								{t('updatePassword.invalid.generateLink')}
							</Button>
						</FormWrapper>
					</Card>
				</MainWrapper>
			</MainLayout>
		)
	}
	return (
		<MainLayout>
			<Helmet>
				<title>Reset password</title>
			</Helmet>
			<MainWrapper>
				<Card>
					<Header>
						<H as='h3' weight='800'>
							{t('updatePassword.title')}
						</H>
						<Text size='medium'>{t('updatePassword.text')}</Text>
					</Header>
					<FormWrapper>
						<form onSubmit={updatePassword}>
							<Form>
								<Input
									type='password'
									label={t('updatePassword.inputs.newPassword')}
									value={newPassword}
									onChange={(e) => setNewPassword(e.currentTarget.value)}
									onBlur={(e) => {
										if (isEmpty(e.currentTarget.value)) {
											setNewPasswordError(
												t('validations.notEmpty', {
													field: t('updatePassword.inputs.newPassword')
												})
											)
											return
										} else {
											setNewPasswordError('')
										}

										if (newPassword.length < 8) {
											setNewPasswordError(t('validations.invalidPassword'))
											return
										}
									}}
									error={newPasswordError}
								/>
								<Input
									type='password'
									label={t('updatePassword.inputs.confirmPassword')}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.currentTarget.value)}
									onBlur={() => {
										if (isEmpty(confirmPassword)) {
											setConfirmPasswordError(
												t('validations.notEmpty', {
													field: t('updatePassword.inputs.confirmPassword')
												})
											)
										} else {
											setConfirmPasswordError('')
										}
									}}
									error={confirmPasswordError}
								/>
								<br />
								<Button
									isBlocked
									onClick={updatePassword}
									loading={isUpdatePasswordLoading}>
									{t('updatePassword.title')}
								</Button>
							</Form>
						</form>
					</FormWrapper>
				</Card>
			</MainWrapper>
		</MainLayout>
	)
}

const TextWrapper = styled.div`
	margin-bottom: 40px;
	text-align: center;
`
export default UpdatePassword
