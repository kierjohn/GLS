import { ReactComponent as LogoDynamic } from 'images/logoDynamic.svg'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

const Footer = () => {
	const { t } = useTranslation('common')
	return (
		<Wrapper>
			<FooterWrapper>
				<Links>
					<Title>{t('home.footer.links.title')}</Title>
					<FootLink to='/'>{t('home.footer.links.home')}</FootLink>
					<FootLink to='/news'>{t('home.footer.links.news')}</FootLink>
					<FootLink to='/about'>{t('home.footer.links.about')}</FootLink>
					<FootLink to='/contact'>{t('home.footer.links.contact')}</FootLink>
					{/* <FootLink to='/faq'>{t('home.footer.links.faq')}</FootLink> */}
				</Links>

				<Links>
					<Title>{t('home.footer.legal.title')}</Title>
					<FootLink to='/privacy-policy'>{t('home.footer.legal.privacy')}</FootLink>
					<FootLink to='/terms-and-conditions'>{t('home.footer.legal.terms')}</FootLink>
					<FootLink to='/legal-notice'>{t('home.footer.legal.notice')}</FootLink>
				</Links>

				<Links>
					<Logo />
					<Text>{t('home.footer.tagline')}</Text>
					{/* <Button>{t('home.footer.subscribe')}</Button> */}
				</Links>
			</FooterWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral007};
	border: 1px solid ${(props) => props.theme.colors.neutral005};
	display: flex;
	flex-direction: column;
	width: 100%;
`

const FooterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 100%;
	@media screen and (min-width: 992px) {
		padding: 60px;
		flex-direction: row;
		max-width: 1200px;
	}
`

const Links = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
	max-width: 600px;
	width: 100%;
	margin: 0 auto;
	@media screen and (min-width: 992px) {
		margin-right: 20px;
		margin-bottom: 0;
		flex: 1;
	}
`

const Title = styled.div`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.large};
	font-weight: 800;
	line-height: 27px;
	margin-bottom: 10px;
	margin-top: 10px;
	padding-bottom: 10px;
	width: 100%;
	@media screen and (min-width: 992px) {
		border-bottom: none;
		margin-top: 0;
	}
`

const Logo = styled(LogoDynamic)`
	width: 180px;
`

const Text = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-weight: 600;
	font-size: ${(props) => props.theme.font.sizes.h4};
	line-height: 32px;
	margin-bottom: 40px;
`

const FootLink = styled(Link)`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 600;
	line-height: 22px;
	margin-bottom: 15px;
	max-width: 600px;
	padding-bottom: 15px;
	width: 100%;
	@media screen and (min-width: 992px) {
		border: none;
		margin-bottom: 5px;
		padding-bottom: 5px;
	}
`

export default Footer
