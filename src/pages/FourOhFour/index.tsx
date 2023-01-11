import Button from '@system/Button'
import H from '@system/H'
import { ReactComponent as BackIcon } from 'icons/arrowBackwardSmall.svg'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { ReactComponent as LogoIcon } from 'images/logo.svg'

const FourOhFour = () => {
	const { t } = useTranslation('common')
	return (
		<Wrapper>
			<Content>
				<LogoWrapper>
					<LogoIcon />
				</LogoWrapper>
				<FOF>404</FOF>
				<H as='h1'>{t('fof.title')}</H>
				<Text>
					<Trans
						t={t}
						i18nKey='fof.text'
						components={[<a href='mailto: support@goleansigma.de'> </a>]}></Trans>
				</Text>
				<Button to='/'>
					<BackIcon />
					{t('fof.goHome')}
				</Button>
			</Content>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	width: 100vw;
`

const Content = styled.div`
	max-width: 404px;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`

const LogoWrapper = styled.div`
	margin-bottom: 60px;
	width: 100%;

	& > svg {
		max-width: 600px;
		width: 100%;
		height: auto;
	}
`

const FOF = styled.div`
	font-size: 240px;
	font-weight: 800;
	letter-spacing: 50px;
	line-height: 200px;
`

const Text = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 20px;
	font-weight: 400;
	line-height: normal;
	margin-bottom: 60px;
`

export default FourOhFour
