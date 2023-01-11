import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import Text from '@system/Text'
import { sendResetPassword } from 'api/Users'
import axios from 'axios'
import Card from 'components/Card'
import { Form, FormWrapper, Header, MainWrapper } from 'components/EntryStyles'
import { ReactComponent as ArrowBackwardIcon } from 'icons/arrowBackward.svg'
import MainLayout from 'layout/MainLayout'
import { FC, FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

const AccountVerification: FC = () => {
	const { t } = useTranslation('common')
	const [email, setEmail] = useState<string>('')
	const [emailError, setEmailError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const toastDispatch = useToastDispatch()
	const navigate = useNavigate()

	const EMAIL_REGEX =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

	const verify = async (e: FormEvent) => {
		e.preventDefault()
		setEmailError('')

		if (isEmpty(email)) {
			setEmailError(
				t('validations.notEmpty', {
					field: t('settings.account.updateEmail')
				})
			)
			return
		}

		if (!EMAIL_REGEX.test(email)) {
			setEmailError(t('validations.invalidEmail'))
			return
		}

		const source = axios.CancelToken.source()

		try {
			setIsLoading(true)
			const result = await sendResetPassword({ email, source })

			if (result.data.error) {
				setEmailError('Invalid email')
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createLocation',
						text: result.data.message,
						type: ToastTypes.danger
					}
				})
			}
			if (result.status === 200) {
				navigate('/email-verification')
				setIsLoading(false)
			} else {
				setIsLoading(false)
			}
		} catch (err: any) {
			setIsLoading(false)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'createLocation',
					text: err?.message,
					type: ToastTypes.danger
				}
			})
			console.error(err.message)
		}
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
							{t('forgetPassword.title')}
						</H>
						<Text size='medium'>{t('forgetPassword.text')}</Text>
					</Header>
					<FormWrapper>
						<form onSubmit={verify}>
							<Form>
								<Input
									label={t('forgetPassword.email')}
									value={email}
									onChange={(e) => setEmail(e.currentTarget.value)}
									error={emailError}
								/>
								<br />
								<Button isBlocked={true} onClick={verify} loading={isLoading}>
									{t('forgetPassword.reset')}
								</Button>
							</Form>
						</form>
					</FormWrapper>
				</Card>
				<Button variant='link-light' to='/login'>
					<ArrowBackwardIcon /> {t('forgetPassword.backToLogin')}
				</Button>
			</MainWrapper>
		</MainLayout>
	)
}

export default AccountVerification
