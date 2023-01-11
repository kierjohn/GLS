import { ReactComponent as LinkedInIcon } from 'icons/linkedin.svg'
import { ReactComponent as TwitterLogo } from 'icons/twitter.svg'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
export type FooterProps = {
	isApp?: boolean
}

const Footer: FC<FooterProps> = ({ isApp = false }) => {
	const { t } = useTranslation('common')

	return (
		<Wrapper>
			<FooterWrapper isApp={isApp}>
				<CopyRight>{t('footer.copyright')}</CopyRight>
				<FooterLinks>
					<FooterLink target='_blank' as='a' href='https://twitter.com/GoLeanSigma'>
						<TwitterLogo />
					</FooterLink>
					<Separator />
					<FooterLink
						target='_blank'
						as='a'
						href='https://www.linkedin.com/company/goleansigma'>
						<LinkedInIcon />
					</FooterLink>
				</FooterLinks>
			</FooterWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.footer`
	display: flex;
	justify-content: center;
`

const FooterWrapper = styled.div<{ isApp: boolean }>`
	align-items: center;
	display: flex;
	justify-content: center;
	width: 100%;
	@media screen and (min-width: 1600px) {
		max-width: ${(props) => (props.isApp ? '100%' : '1600px;')};
	}
`

const CopyRight = styled.div`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	letter-spacing: 0.04em;
	padding: 10px 20px;
	margin-right: auto;

	@media screen and (min-width: 992px) {
		margin-left: 0;
	}
`

const FooterLinks = styled.ul<{ center?: boolean }>`
	align-items: center;
	display: none;
	flex: ${(props) => (props.center ? '1' : '0')};
	justify-content: center;
	list-style-type: none;
	margin: 0;
	margin-left: ${(props) => (props.center ? 'auto' : '20px')};
	margin-right: ${(props) => (props.center ? 'auto' : '20px')};
	padding-right: 20px;
	padding: 0;
	width: 100%;
	@media screen and (min-width: 768px) {
		display: flex;
	}
	@media screen and (min-width: 1200px) {
		max-width: 1200px;
	}
`

const FooterLink = styled(Link)`
	border-radius: ${(props) => props.theme.radius.medium};
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	letter-spacing: 0.04em;
	margin-bottom: 10px;
	margin-top: 10px;
	padding: 5px 10px;
	&:hover {
		background: ${(props) => props.theme.colors.neutral005};
	}

	& > svg {
		height: 16px;
	}
`

const Separator = styled.span`
	height: 20px;
	border-left: 1px solid ${(props) => props.theme.colors.neutral004};
	margin: 0 5px;
`

export default Footer
