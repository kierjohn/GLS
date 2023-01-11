import Loader from 'components/Loader'
import { ReactComponent as SixSIcon } from 'icons/6s.svg'
import { ReactComponent as AccountIcon } from 'icons/account.svg'
import { ReactComponent as PasswordIcon } from 'icons/password.svg'
import { ReactComponent as PersonIcon } from 'icons/person.svg'
import MainLayout from 'layout/MainLayout'
import { useMeState } from 'providers/Me'
import { FC } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components/macro'

export const initialErrors = {
	firstname: '',
	lastname: '',
	username: '',
	email: '',
	confirmEmail: '',
	currentPassword: '',
	newPassword: '',
	confirmPassword: ''
}

const Settings: FC = () => {
	const { t } = useTranslation('common')
	const { isLoading } = useMeState()

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Settings</title>
			</Helmet>
			<Wrapper>
				<Menu>
					<Header>
						<Title>{t('userContext.ucSettings.title')}</Title>
					</Header>
					<Items>
						<Item to='/settings/personal'>
							<PersonIcon />
							<Text>{t('userContext.ucSettings.personalInformation')}</Text>
						</Item>

						<Item to='/settings/account'>
							<AccountIcon />
							<Text>{t('userContext.ucSettings.accountInformation')}</Text>
						</Item>

						<Item to='/settings/password'>
							<PasswordIcon />
							<Text>{t('userContext.ucSettings.passwordSettings')}</Text>
						</Item>

						<Item to='/settings/sixs'>
							<SixSIcon />
							<Text>{t('userContext.ucSettings.AuditSettings')}</Text>
						</Item>
						{/* <Item to='/settings/subscription'>
							<DiamondIcon />
							<Text>{t('userContext.ucSettings.subscription')}</Text>
						</Item> */}
					</Items>
				</Menu>
				{isLoading && <Loader isModal />}
				<Outlet />
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: auto;
	position: relative;
	width: 100%;
`

const Menu = styled.div`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-left: 1px solid ${(props) => props.theme.colors.neutral006};
	border-right: 1px solid ${(props) => props.theme.colors.neutral006};
	display: none;
	flex-direction: column;
	width: 320px;
	@media screen and (min-width: 992px) {
		display: flex;
	}
`

const Header = styled.div`
	align-items: center;
	display: flex;
	height: 100px;
	padding: 20px 0;
	width: 100%;

	@media screen and (min-width: 992px) {
		padding: 20px;
	}
`

const Title = styled.h2`
	font-size: ${(props) => props.theme.font.sizes.h4};
	margin-right: 10px;
	@media screen and (min-width: 992px) {
		margin-right: auto;
	}
`

const Items = styled.div`
	display: flex;
	flex-direction: column;
`

const Item = styled(NavLink)`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	color: ${(props) => props.theme.colors.neutral003};
	margin: 0 20px;
	padding: 20px 20px 20px 0;
	&:first-child {
		border-top: 1px solid ${(props) => props.theme.colors.neutral005};
	}
	&:last-child {
		border: none;
	}
	&.active {
		color: ${(props) => props.theme.colors.neutral000};
	}
	& > svg {
		width: 30px;
	}
`

const Text = styled.span`
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 600;
	margin-left: 10px;
`

export default Settings
