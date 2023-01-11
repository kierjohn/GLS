import Button from '@system/Button'
import Checkbox from '@system/Checkbox'
import Input from '@system/Input'
import {
	ActionWrapper,
	ButtonWrapper,
	Darken,
	Form,
	FormWrapper
} from 'components/EntryStyles'
import React, { Dispatch, FC, FormEvent, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export type EmailFormProps = {
	email: string
	password: string
	errors: any
	isLoading: boolean
	rememberMe: boolean
	setEmail: Dispatch<SetStateAction<string>>
	setPassword: Dispatch<SetStateAction<string>>
	setRememberMe: Dispatch<SetStateAction<boolean>>
	setIsOptionsOpen: (isOPen: boolean) => void
	onSubmit: (e: FormEvent) => void
}

const EmailForm: FC<EmailFormProps> = ({
	email,
	password,
	errors,
	isLoading,
	rememberMe,
	setEmail,
	setPassword,
	setRememberMe,
	onSubmit
}) => {
	const { t } = useTranslation('common')
	return (
		<FormWrapper>
			<form onSubmit={onSubmit}>
				<Form>
					<Input
						error={errors.email}
						label={t('entry.form.email')}
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
					<Input
						error={errors.password}
						label={t('entry.form.password')}
						type='password'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
					<Checkbox
						label={t('entry.form.remember')}
						value={rememberMe}
						onCheck={() => setRememberMe((isChecked) => !isChecked)}
					/>
					<Button type='submit' loading={isLoading} isBlocked={true}>
						{t('entry.form.login')}
					</Button>
				</Form>
			</form>
			<ButtonWrapper>
				<Button variant='link' to='/forgot-password' hasPadding={false}>
					{t('entry.form.forgetPassword')}
				</Button>
				{/* <Button block variant='ghost' onClick={() => setIsOptionsOpen(true)}>
					<KeyIcon /> Login options
				</Button> */}
				<ActionWrapper>
					<Darken>{t('entry.form.noAccount')}</Darken>
					<Link to='/signup'>{t('entry.form.join')}</Link>
				</ActionWrapper>
			</ButtonWrapper>
		</FormWrapper>
	)
}

export default EmailForm
