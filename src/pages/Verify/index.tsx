import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { verifyEmail } from 'api/Users'
import axios from 'axios'
import Loader from 'components/Loader'
import { ReactComponent as ConfettiIcon } from 'icons/confetti.svg'
import { ReactComponent as FailedIcon } from 'icons/failed.svg'
import MainLayout from 'layout/MainLayout'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const Verify: FC = () => {
	const { t } = useTranslation('common')
	const { token } = useParams()
	const [error, setErorr] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		const fn = async () => {
			const source = axios.CancelToken.source()

			try {
				setIsLoading(true)
				const { data } = await verifyEmail({ token: `${token}`, source })

				setErorr(data.error)
				setIsLoading(false)
			} catch (error) {
				console.error(error)
				setIsLoading(false)
			}
		}

		fn()
	}, [token])

	if (isLoading) {
		return (
			<MainLayout isChildWrapped={false}>
				<Loader />
			</MainLayout>
		)
	}
	if (!isLoading && error) {
		return (
			<MainLayout isChildWrapped={false} isVerification>
				<Wrapper>
					<FailedIcon />
					<Title as='h3'>{t('verify.error.title')}</Title>
					<Description>{t('verify.error.text')}</Description>
					<Button width='240px' to='/settings/account'>
						{t('verify.error.manage')}
					</Button>
				</Wrapper>
			</MainLayout>
		)
	}
	return (
		<MainLayout isChildWrapped={false} isVerification>
			<Wrapper>
				<ConfettiIcon />
				<Title as='h3'>{t('verify.success.title')}</Title>
				<Description>{t('verify.success.text')}</Description>
				<Button width='240px' to='/'>
					{t('verify.success.continue')}
				</Button>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	height: 100%;
	max-width: 320px;
	margin: 0 auto;
	flex: 1;
`

const Title = styled(H)`
	font-size: ${(props) => props.theme.font.sizes.h2};
	line-height: 42px;
	margin-bottom: 20px;
	margin-top: 40px;
	text-align: center;
`

const Description = styled(Text)`
	font-size: ${(props) => props.theme.font.sizes.large};
	margin-bottom: 60px;
	text-align: center;
`

export default Verify
