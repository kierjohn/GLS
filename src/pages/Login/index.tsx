import H from '@system/H'
import Text from '@system/Text'
import { login } from 'api/Entry'
import { EntryCard, Header, MainWrapper } from 'components/EntryStyles'
import MainLayout from 'layout/MainLayout'
import { isNil } from 'lodash'
import { useMeDispatch } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EmailForm from './EmailForm'
import SigninOption from './SigninOption'

const Login: FC = () => {
	const { t } = useTranslation('common')
	const [formErrors, setFormErrors] = useState<any>({})
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const [rememberMe, setRememberMe] = useState<boolean>(false)
	const [username, setUsername] = useState<string>('')

	const navigate = useNavigate()
	const toastDispatch = useToastDispatch()
	const meDispatch = useMeDispatch()

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	const onLogin = async (e: FormEvent) => {
		e.preventDefault()
		setFormErrors({})
		setIsLoading(true)

		if (isNil(username) || username === '') {
			setFormErrors((formErrors: any) => ({
				...formErrors,
				email: t('validations.notEmpty', { field: 'Email' })
			}))
			setIsLoading(false)
			return
		}

		if (!username.toLocaleLowerCase().match(EMAIL_REGEX)) {
			setFormErrors((formErrors: any) => ({
				...formErrors,
				email: t('validations.invalidEmail')
			}))
			setIsLoading(false)
			return
		}

		if (isNil(password) || password === '') {
			setFormErrors((formErrors: any) => ({
				...formErrors,
				password: t('validations.notEmpty', { field: 'Password' })
			}))
			setIsLoading(false)
			return
		}

		if (password.length < 8) {
			setFormErrors((formErrors: any) => ({
				...formErrors,
				password: t('validations.invalidPassword')
			}))
			setIsLoading(false)
			return
		}

		try {
			const { data } = await login({ username, password })

			if (data?.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'signupError',
						text: data?.message,
						type: ToastTypes.danger
					}
				})

				setIsLoading(false)
				return
			}

			localStorage.setItem('token', data?.data?.token)
			meDispatch({ type: MeActions.updateLoggedInStatus, payload: true })

			setIsLoading(false)
			window.location.reload()
		} catch (err: any) {
			console.error(err)
			setIsLoading(false)
		}
	}

	return (
		<MainLayout>
			<Helmet>
				<title>Login</title>
			</Helmet>
			<MainWrapper>
				<EntryCard>
					<Header>
						<H as='h3' weight='800'>
							{t('entry.title')}
						</H>
						<Text size='medium'>{t('entry.text')}</Text>
					</Header>
					{!isOptionsOpen ? (
						<EmailForm
							email={username}
							errors={formErrors}
							isLoading={isLoading}
							password={password}
							rememberMe={rememberMe}
							setEmail={setUsername}
							setPassword={setPassword}
							onSubmit={onLogin}
							setIsOptionsOpen={setIsOptionsOpen}
							setRememberMe={setRememberMe}
						/>
					) : (
						<SigninOption setIsOptionsOpen={setIsOptionsOpen} />
					)}
				</EntryCard>
			</MainWrapper>
		</MainLayout>
	)
}

export default Login
