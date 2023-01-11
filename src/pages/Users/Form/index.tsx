import Button from '@system/Button'
import Checkbox from '@system/Checkbox'
import Input from '@system/Input'
import Select from '@system/Select'
import { createUser, removeUser, updateUser } from 'api/Users'
import ConfirmationMessage from 'components/ConfirmationMessage'
import Modal from 'components/Modal'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { DateTime } from 'luxon'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { useUsersDispatch } from 'providers/Users'
import { UserActions, UserProps } from 'providers/Users/types'
import {
	Dispatch,
	FC,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { formatUser } from 'utils/helpers'
import useUserFormValidation from './Validation'
export type UserFormProps = {
	initValue?: UserProps
	isEdit: boolean
	isVisible: boolean
	setIsVisible: Dispatch<SetStateAction<boolean>>
}

const Form: FC<UserFormProps> = ({ initValue, isEdit, isVisible, setIsVisible }) => {
	const { t } = useTranslation('common')

	const [email, setEmail] = useState<string>('')
	const [firstname, setFirstname] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [issues, setIssues] = useState<boolean>(false)
	const [language, setLanguage] = useState<string>('')
	const [lastname, setLastname] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [role, setRole] = useState<number>(2)
	const [status, setStatus] = useState<string>('1')
	const [tester, setTester] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')
	const [verificationLink, setVerificationLink] = useState<string>('')
	const [verified, setVerified] = useState<boolean>(true)

	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const initialErrors = {
		email: '',
		firstname: '',
		language: '',
		lastname: '',
		password: '',
		role: '',
		status: '',
		targetScore: '',
		taskOrder: '',
		theme: '',
		username: '',
		verified: '',
		issues: ''
	}

	const { errors, clearErrors, validateField } = useUserFormValidation({
		initialErrors
	})

	const dispatch = useUsersDispatch()
	const toastDispatch = useToastDispatch()

	/* eslint-disable */
	const clearForm = useCallback(() => {
		setEmail('')
		setFirstname('')
		setLanguage('')
		setLastname('')
		setPassword('')
		setRole(1)
		setStatus('1')
		setUsername('')
		setVerified(false)
		setTester(false)
		setIssues(false)

		clearErrors()
	}, [])
	/* eslint-enable */

	useEffect(() => {
		clearForm()

		if (isEdit && initValue) {
			setEmail(initValue.email)
			setFirstname(initValue.firstname)
			setLanguage(initValue.language)
			setLastname(initValue.lastname)
			setRole(initValue.role)
			setStatus(initValue.status)
			setUsername(initValue.username)
			setVerified(initValue.verified)
			setTester(initValue.tester)
			setIssues(initValue.issues)
			setVerificationLink(`https://app.goleansigma.de/verify/${initValue.userToken}`)
		}

		return () => {
			clearForm()
		}
	}, [initValue, isEdit, clearForm])

	const onCreate = async () => {
		setIsLoading(true)

		try {
			const result = await createUser({
				email,
				firstname,
				language,
				lastname,
				password,
				role,
				username,
				verified,
				status
			})

			if (!result?.data?.error) {
				const {
					data: { data: newUser }
				} = result

				dispatch({
					type: UserActions.add,
					payload: formatUser(newUser)
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createUser',
						text: result?.data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
				setIsLoading(false)
				setIsVisible(false)
			} else {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createUser',
						text: result?.data?.message,
						type: ToastTypes.danger
					}
				})
				setIsLoading(false)
			}
		} catch (err) {
			console.error(err)
			setIsLoading(false)
			setIsVisible(false)
		}
	}

	const onEdit = async () => {
		setIsLoading(true)

		try {
			const { data } = await updateUser({
				id: initValue?.id,
				email,
				firstname,
				language,
				lastname,
				password,
				role,
				status,
				tester,
				username,
				verified,
				issues
			})

			if (!data?.error && initValue) {
				dispatch({
					type: UserActions.update,
					payload: {
						...initValue,
						email,
						firstname,
						language,
						lastname,
						password,
						role,
						username,
						verified,
						status,
						tester,
						issues
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'updateUser',
						text: data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
			}

			setIsLoading(false)
			setIsVisible(false)
		} catch (err) {
			console.error(err)
			setIsLoading(false)
			setIsVisible(false)
		}
	}

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (isEdit) {
			onEdit()
		} else {
			onCreate()
		}
	}

	const onRemove = async () => {
		if (!initValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeUser({ id: initValue.id, status: '0' })
			dispatch({ type: UserActions.remove, payload: initValue.id })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeUser',
					text: (
						<>
							<Trans
								t={t}
								i18nKey='users.toast.deleted'
								components={[<strong />]}
								values={{
									user: `${initValue?.firstname} ${initValue?.lastname}`
								}}></Trans>
						</>
					),
					type: ToastTypes.danger
				}
			})
		} catch (error) {
			console.error(error)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeUser',
					text: String(error),
					type: ToastTypes.danger
				}
			})
		}
		setIsDeleteLoading(false)
		setIsDeleteConfirmationVisible(false)
	}

	const onConfirmationClose = () => {
		setIsDeleteConfirmationVisible(false)
		setIsVisible(true)
	}

	return (
		<>
			<Modal
				title={`${isEdit ? 'Update user' : 'Create user'}`}
				onClose={setIsVisible}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<Input
							error={errors.firstname}
							label='Firstname'
							onChange={(e) => {
								validateField({
									field: 'firstname',
									value: e.currentTarget.value
								})
								setFirstname(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'firstname',
									value: e.currentTarget.value
								})
							}}
							value={firstname}
						/>

						<Input
							error={errors.lastname}
							label='Lastname'
							onChange={(e) => {
								validateField({
									field: 'lastname',
									value: e.currentTarget.value
								})
								setLastname(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'lastname',
									value: e.currentTarget.value
								})
							}}
							value={lastname}
						/>

						<Input
							error={errors.email}
							label='Email'
							onChange={(e) => {
								validateField({
									field: 'email',
									value: e.currentTarget.value
								})
								setEmail(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'email',
									value: e.currentTarget.value
								})
							}}
							value={email}
						/>

						<Input
							error={errors.username}
							label='Username'
							onChange={(e) => {
								validateField({
									field: 'username',
									value: e.currentTarget.value
								})
								setUsername(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'username',
									value: e.currentTarget.value
								})
							}}
							value={username}
						/>

						<Select
							error={errors.role}
							label='Role'
							value={role}
							onBlur={(e) => {
								validateField({ field: 'role', value: e.currentTarget.value })
							}}
							onChange={(e) => {
								validateField({ field: 'role', value: e.currentTarget.value })
								setRole(Number(e.currentTarget.value))
							}}>
							<option value={1}>Admin</option>
							<option value={2}>User</option>
						</Select>

						<Select
							error={errors.status}
							label='Status'
							value={status}
							onBlur={(e) => {
								validateField({ field: 'status', value: e.currentTarget.value })
							}}
							onChange={(e) => {
								validateField({ field: 'status', value: e.currentTarget.value })
								setStatus(e.currentTarget.value)
							}}>
							<option value='1'>Active</option>
							<option value='0'>Inactive</option>
						</Select>
						<Select
							error={errors.language}
							label='Language'
							value={language}
							onBlur={(e) => {
								validateField({ field: 'language', value: e.currentTarget.value })
							}}
							onChange={(e) => {
								validateField({ field: 'language', value: e.currentTarget.value })
								setLanguage(e.currentTarget.value)
							}}>
							<option value='en'>English (US)</option>
							<option value='de'>German</option>
						</Select>
						<Input
							error={errors.password}
							label='Password'
							onChange={(e) => {
								validateField({
									field: 'password',
									value: e.currentTarget.value
								})
								setPassword(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'password',
									value: e.currentTarget.value
								})
							}}
							type='password'
							value={password}
						/>

						{isEdit &&
							initValue &&
							DateTime.fromJSDate(new Date(initValue?.userTokenExpires)).isValid &&
							DateTime.fromJSDate(new Date(initValue?.userTokenExpires)).diffNow(
								'minutes'
							).minutes > 0 && (
								<Input
									label='Verification Link'
									value={verificationLink}
									onChange={() => {}}
								/>
							)}

						<Checkbox
							label='Tester'
							description='Bypass subscription and email verification.'
							value={tester}
							onCheck={() => setTester((isCheck) => !isCheck)}
						/>
						<Checkbox
							label='Verified'
							description='The user verification status will be initially verified without further action.'
							value={verified}
							onCheck={() => setVerified((isCheck) => !isCheck)}
						/>
						<Checkbox
							label='Signup Issue'
							description='User can`t login for some reason. Uncheck only when the issue is resolved.'
							value={issues}
							onCheck={() => setIssues((isCheck) => !isCheck)}
						/>

						<ActionWrapper>
							{!isEdit && (
								<Button type='submit' loading={isLoading}>
									<PlusIcon /> Add user
								</Button>
							)}
							{isEdit && initValue && (
								<>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isDeleteLoading}
										variant='danger-ghost'
										onClick={() => {
											setIsVisible(false)
											setIsDeleteConfirmationVisible(true)
										}}>
										<TrashIcon />
										Delete
									</Button>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isLoading}
										type='submit'>
										<SaveIcon />
										Save changes
									</Button>
								</>
							)}
						</ActionWrapper>
					</Wrapper>
				</form>
			</Modal>
			<ConfirmationMessage
				confirmText={initValue?.email}
				doneIcon={<TrashIcon />}
				doneText={t('confirmation.doneText')}
				isDanger={true}
				isLoading={isDeleteLoading}
				isVisible={isDeleteConfirmationVisible}
				message={
					<>
						<p>
							<strong>{t('confirmation.message.strong')} </strong>{' '}
							{t('confirmation.message.text', { item: 'user' })}
						</p>
						<br />
						<p>
							<Trans
								t={t}
								i18nKey='confirmation.message.typeToContinue'
								components={[<strong />]}
								values={{
									value: initValue?.email
								}}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: 'user' })}
				onDone={onRemove}
				onClose={onConfirmationClose}
			/>
		</>
	)
}

const Wrapper = styled.div`
	& > * {
		margin-bottom: 20px;
	}
`

const ActionWrapper = styled.div`
	display: flex;
	margin-top: 40px;
	& > * {
		flex-shrink: 1;
		padding: 10px 20px;
		&:first-child {
			margin-right: 10px;
			margin-left: auto;
		}
	}
`

export default Form
