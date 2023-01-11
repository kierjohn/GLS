import Button from '@system/Button'
import Input from '@system/Input'
import Text from '@system/Text'
import {
	ActionWrapper,
	ButtonWrapper,
	Darken,
	Form,
	FormWrapper
} from 'components/EntryStyles'
import { Dispatch, FC, FormEvent, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export type EmailFormProps = {
	email: string
	password: string
	errors: any
	isLoading: boolean
	setEmail: Dispatch<SetStateAction<string>>
	setPassword: Dispatch<SetStateAction<string>>
	onSubmit: (e: FormEvent) => void
}

const EmailForm: FC<EmailFormProps> = ({
	email,
	password,
	errors,
	isLoading,
	setEmail,
	setPassword,
	onSubmit
}) => {
	const { t } = useTranslation('common')
	const language = window.localStorage.getItem('language')

	return (
		<FormWrapper>
			<form onSubmit={onSubmit}>
				<Form>
					<Input
						error={errors?.email}
						label={t('entry.form.email')}
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
					<Input
						error={errors?.password}
						label={t('entry.form.password')}
						type='password'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
					<Agreement>
						By signing up, I have read and agree to the{' '}
						{language === 'en' ? (
							<a href='https://goleansigma.de/en-pages/terms-and-conditions'>
								Terms and conditions
							</a>
						) : (
							<a href='https://goleansigma.de/pages/terms-and-conditions'>
								Terms and conditions
							</a>
						)}
						.
					</Agreement>
					<Button type='submit' loading={isLoading} isBlocked>
						{t('entry.form.createAccount')}
					</Button>
				</Form>
			</form>

			{/* <Button block variant='ghost' onClick={() => setIsOptionsOpen(true)}>
				<KeyIcon /> Sign up options
			</Button> */}
			<ButtonWrapper>
				<ActionWrapper>
					<Darken>{t('entry.form.hasAccount')}</Darken>
					<Link to='/login'>{t('entry.form.login')}</Link>
				</ActionWrapper>
			</ButtonWrapper>
		</FormWrapper>
	)
}

const Agreement = styled(Text)`
	background: transparent;
	display: inline-block;
	line-height: 1.3em;
	margin-bottom: 20px;
`

export default EmailForm
