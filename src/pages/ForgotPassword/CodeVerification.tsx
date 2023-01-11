import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import Card from 'components/Card'
import { FormWrapper, Header, MainWrapper } from 'components/EntryStyles'
import MainLayout from 'layout/MainLayout'
import { FC } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const CodeVerification: FC = () => {
	const { t } = useTranslation('common')

	return (
		<MainLayout>
			<Helmet>
				<title>Reset password</title>
			</Helmet>
			<MainWrapper>
				<Card>
					<Header>
						<H as='h3' weight='800'>
							{t('accountVerification.title')}
						</H>
						<Text size='medium'>{t('accountVerification.text')}</Text>
						<br />
						<br />
						<Text size='medium'>{t('accountVerification.resendText')}</Text>
						<Text size='medium'>
							{' '}
							or <Link to='/forgot-password'>try another email</Link>
						</Text>
					</Header>
					<FormWrapper>
						<Button isBlocked={true} variant='ghost' to='/forgot-password'>
							try another email
						</Button>
					</FormWrapper>
				</Card>
			</MainWrapper>
		</MainLayout>
	)
}

export default CodeVerification
