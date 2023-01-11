import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import Select from '@system/Select'
import Text from '@system/Text'
import api from 'api'
import { getProfile, updateProfile } from 'api/Profile'
import { sendEmailVerification } from 'api/Users'
import axios from 'axios'
import ConfirmationMessage from 'components/ConfirmationMessage'
import { Body, Footer, Header, Wrapper } from 'components/SettingsStyle'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { isEmpty, isNil, trim } from 'lodash'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatUser, logout } from 'utils/helpers'
import { initialErrors } from '.'
import useAreaFormValidation from './Validation'

const Account: FC = () => {
	const { t } = useTranslation('common')

	const toastDispatch = useToastDispatch()
	const dispatch = useMeDispatch()
	const data = useMeState()

	const { clearErrors, errors, validateField } = useAreaFormValidation({ initialErrors })

	const [confirmEmail, setConfirmEmail] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [username, setUsername] = useState<string>('')
	const [language, setLanguage] = useState<string>('')

	const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
	const [isDownloadLoading, setIsDownloadLoading] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isResendLoading, setIsResendLoading] = useState<boolean>(false)

	const resendVerification = async (email?: string) => {
		try {
			setIsResendLoading(true)
			const source = axios.CancelToken.source()
			const result = await sendEmailVerification({
				email: email ? email : data.email,
				source
			})

			if (result.data.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'errorResendVerification',
						text: String(result.data.message),
						type: ToastTypes.danger
					}
				})
			}

			setIsResendLoading(false)
		} catch (error) {
			console.error(error)
			setIsResendLoading(false)
		}
	}

	const downloadData = async () => {
		setIsDownloadLoading(true)
		const res = await api.get(`/user/download/${data.id}`)

		window.open(`${process.env.REACT_APP_API_URL}/public/data/${res.data.data.file}`)
		setIsDownloadLoading(false)
	}

	const openDeleteConfirmation = () => setIsDeleteConfirmationOpen(true)

	const deleteAccount = async () => {
		try {
			setIsDeleteLoading(true)
			await api.delete(`/user/${data.id}`)

			setIsDeleteConfirmationOpen(false)
			logout()

			setIsDeleteLoading(false)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'successDeleteUser',
					text: `Account has been successfully removed.`,
					type: ToastTypes.info
				}
			})
		} catch (error: any) {
			setIsDeleteLoading(false)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'errorDeleteUser',
					text: `Something went wrong. error: ${String(error)}`,
					type: ToastTypes.danger
				}
			})
		}
	}

	/* eslint-disable */
	useEffect(() => {
		const fn = async () => {
			const source = axios.CancelToken.source()
			const { data } = await getProfile({ source })
			const { data: me } = data

			const formattedMe = formatUser({ ...me, isLoggedIn: true })
			dispatch({
				type: MeActions.fetch,
				payload: formattedMe
			})
		}

		fn()
	}, [isLoading])
	/* eslint-disable */

	useEffect(() => {
		setLanguage(data.language)
		setUsername(data.username)
	}, [data.language, data.username])

	const updateAccountInformation = async (e: FormEvent) => {
		e.preventDefault()

		const isUsernameValid = validateField({ field: 'username', value: username })
		const isEmailValid = !isEmpty(trim(email))
			? validateField({ field: 'email', value: email })
			: true
		const isConfirmEmailValid = !isEmpty(trim(email))
			? validateField({
					field: 'confirmEmail',
					value: confirmEmail,
					testValue: email
			  })
			: true

		if (!isUsernameValid || !isEmailValid || !isConfirmEmailValid) {
			return
		}

		setIsLoading(true)

		try {
			const updatedProfile = !isEmpty(trim(email))
				? {
						...data,
						email: trim(email),
						username: trim(username),
						language
				  }
				: {
						...data,
						username: trim(username),
						language
				  }

			const res = await updateProfile(updatedProfile)
			if (!isNil(email)) {
				resendVerification(email)
			}

			if (res.data.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileError',
						text: t('settings.toast.error'),
						type: ToastTypes.danger
					}
				})
				setIsLoading(false)
			} else {
				const payload = !isEmpty(trim(email))
					? {
							...data,
							email: trim(email),
							language: language,
							username: trim(username)
					  }
					: {
							...data,
							language: language,
							username: trim(username)
					  }
				dispatch({
					type: MeActions.update,
					payload
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileSuccess',
						text: t('settings.toast.update', { settings: t('settings.account.title') }),
						type: ToastTypes.info
					}
				})
				setIsLoading(false)
				setEmail('')
				setConfirmEmail('')
				clearErrors()
			}
		} catch (error) {
			console.error('error', error)
			setIsLoading(false)
		}
	}

	return (
		<Wrapper>
			<ConfirmationMessage
				isVisible={isDeleteConfirmationOpen}
				confirmText={data.email}
				doneIcon={<TrashIcon />}
				doneText={t('confirmation.doneText')}
				isDanger={true}
				message={
					<>
						<p>
							<strong>{t('settings.account.deleteMessage')}</strong>
						</p>
						<br />
						<p>{t('settings.account.downloadMessage')}</p>
						<br />
						<Button
							loading={isDownloadLoading}
							variant='light'
							onClick={downloadData}
							isBlocked>
							{t('settings.account.downloadMyData')}
						</Button>
						<br />
						<br />

						<p>
							<Trans
								t={t}
								i18nKey='settings.account.typeToContinue'
								components={[<strong />]}
								values={{ email: data.email }}></Trans>
						</p>
					</>
				}
				title={'Delete confirmation'}
				onClose={() => setIsDeleteConfirmationOpen(false)}
				isLoading={isDeleteLoading}
				onDone={deleteAccount}
			/>
			<form onSubmit={updateAccountInformation}>
				<Header>
					<H as='h4'>{t('settings.account.title')}</H>
				</Header>
				<Body>
					<Input
						error={errors.username}
						type='text'
						value={username}
						label={t('settings.account.username')}
						onBlur={(e) => {
							validateField({ field: 'username', value: trim(e.currentTarget.value) })
						}}
						onChange={(e) => {
							validateField({ field: 'username', value: trim(e.currentTarget.value) })
							setUsername(e.currentTarget.value)
						}}
					/>
					<H as='h5'>{t('settings.account.updateEmail')}</H>
					<Input
						type='text'
						value={data.email}
						label={t('settings.account.email')}
						onChange={() => {}}
					/>
					<Input
						error={errors.email}
						type='text'
						value={email}
						label={t('settings.account.newEmail')}
						onBlur={(e) => {
							validateField({ field: 'email', value: trim(e.currentTarget.value) })
						}}
						onChange={(e) => {
							validateField({ field: 'email', value: trim(e.currentTarget.value) })
							setEmail(e.currentTarget.value)
						}}
					/>
					<Input
						error={errors.confirmEmail}
						type='text'
						value={confirmEmail}
						label={t('settings.account.confirmEmail')}
						onBlur={(e) => {
							validateField({
								field: 'confirmEmail',
								value: trim(e.currentTarget.value),
								testValue: email
							})
						}}
						onChange={(e) => {
							validateField({
								field: 'confirmEmail',
								value: trim(e.currentTarget.value),
								testValue: email
							})
							setConfirmEmail(e.currentTarget.value)
						}}
					/>
					{!data.verified && (
						<Button
							isBlocked
							loading={isResendLoading}
							onClick={() => resendVerification()}
							variant='ghost'>
							{t('settings.account.resendVerification')}
						</Button>
					)}
					<H as='h5'>{t('settings.account.language')}</H>
					<Select
						label={t('settings.account.language')}
						value={language}
						onChange={(e) => {
							validateField({ field: 'type', value: e.currentTarget.value })
							setLanguage(e.currentTarget.value)
						}}>
						<option value='en'>English (US)</option>
						<option value='de'>German</option>
					</Select>
					<DeleteWrapper>
						<H as='h5' color='danger'>
							{t('settings.account.deletion')}
						</H>
						<Text size='normal' color='neutral003'>
							{t('settings.account.deleteMessage')}
						</Text>
						<Button variant='danger' onClick={openDeleteConfirmation} isBlocked>
							<TrashIcon />
							{t('settings.account.delete')}
						</Button>
					</DeleteWrapper>
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

const DeleteWrapper = styled.div`
	& > * {
		margin-bottom: 10px;
	}

	& > button {
		margin-top: 20px;
	}
`

const DeleteMessageWrapper = styled.div`
	display: flex;
	flex-direction: column;

	& > * {
		margin-bottom: 24px;
	}
`

export default Account
