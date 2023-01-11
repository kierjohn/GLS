import H from '@system/H'
import Text from '@system/Text'
import { register } from 'api/Entry'
import { EntryCard, Header, MainWrapper } from 'components/EntryStyles'
import MainLayout from 'layout/MainLayout'
import { isNil } from 'lodash'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import EmailForm from './EmailForm'
import SigninOption from './SigninOption'

const Signup: FC = () => {
	const { t } = useTranslation('common')
	const [email, setEmail] = useState<string>('')
	const [formErrors, setFormErrors] = useState<any>({})
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false)
	const [password, setPassword] = useState<string>('')
	const toastDispatch = useToastDispatch()
	const navigate = useNavigate()

	const EMAIL_PATTERN =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	const onSignup = async (e: FormEvent) => {
		e.preventDefault()
		setFormErrors({})
		setIsLoading(true)

		if (isNil(email) || email === '') {
			setFormErrors((formErrors: any) => ({
				...formErrors,
				email: t('validations.notEmpty', { field: 'Email' })
			}))
			setIsLoading(false)
			return
		}

		if (!email.toLocaleLowerCase().match(EMAIL_PATTERN)) {
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
			const { data } = await register({ email, password })

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

			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'signupSuccess',
					text: `${data?.message} Redirecting to login...`,
					type: ToastTypes.info
				}
			})
			navigate('/login')
			setIsLoading(false)
		} catch (err: any) {
			console.error(err)
			setIsLoading(false)
		}
	}

	return (
		<MainLayout>
			<Helmet>
				<title>Signup</title>
			</Helmet>
			<MainWrapper>
				<EntryCard>
					<Header>
						<H as='h3' weight='800'>
							{t('entry.createAnAccount')}
						</H>
						<Text size='medium'>{t('entry.welcome')}</Text>
					</Header>
					{!isOptionsOpen ? (
						<EmailForm
							email={email}
							errors={formErrors}
							isLoading={isLoading}
							password={password}
							setEmail={setEmail}
							setPassword={setPassword}
							onSubmit={onSignup}
						/>
					) : (
						<SigninOption setIsOptionsOpen={setIsOptionsOpen} />
					)}
				</EntryCard>
			</MainWrapper>
		</MainLayout>
	)
}

export default Signup
