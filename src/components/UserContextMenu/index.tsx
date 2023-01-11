import { updateProfile } from 'api/Profile'
import Card from 'components/Card'
import { ReactComponent as FeedbackIcon } from 'icons/feedback.svg'
import { ReactComponent as LogoutIcon } from 'icons/logout.svg'
import { ReactComponent as MoonIcon } from 'icons/moon.svg'
import { ReactComponent as RequestFeatureIcon } from 'icons/requestFeature.svg'
import { ReactComponent as SettingsIcon } from 'icons/settings.svg'
import { ReactComponent as CloseIcon } from 'icons/times.svg'
import { useMeState } from 'providers/Me'
import { useReportsState } from 'providers/Reports'
import { useFetchCount } from 'providers/Reports/useFetchCounts'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { logout } from 'utils/helpers'
import Settings from './Settings'

export type UserContextMenuProps = {
	isActive: boolean
	isSettingsActive: boolean
	setIsContextOpen: Dispatch<SetStateAction<boolean>>
	setIsSettingsActive: Dispatch<SetStateAction<boolean>>
}

const UserContextMenu: FC<UserContextMenuProps> = ({
	isActive,
	isSettingsActive,
	setIsContextOpen,
	setIsSettingsActive
}) => {
	const { t } = useTranslation('common')
	const user = useMeState()
	const { counts } = useReportsState()

	useFetchCount()

	const toggleDarkmode = async () => {
		try {
			await updateProfile({
				...user,
				theme: user.theme === 'dark' ? 'light' : 'dark'
			})

			window.location.reload()
		} catch (error) {
			console.error('error', error)
		}
	}

	if (isSettingsActive) {
		return (
			<Wrapper isActive={isActive}>
				<Settings setIsContextOpen={setIsContextOpen} setIsActive={setIsSettingsActive} />
			</Wrapper>
		)
	}

	return (
		<Wrapper isActive={isActive}>
			<UserWrapper>
				<ProfileInfo>
					<ProfileName>
						{Boolean(user.firstname) && Boolean(user.lastname)
							? `${user.firstname} ${user.lastname}`
							: 'New User'}
					</ProfileName>
					<ProfileNameText>{user.email}</ProfileNameText>
				</ProfileInfo>
				<Close onClick={() => setIsContextOpen(false)}>
					<CloseIcon />
				</Close>
			</UserWrapper>
			<ProfileDatas>
				<ProfileData>
					<ProfileInfoTitle>{t('userContext.areas')}</ProfileInfoTitle>
					<ProfileInfoValue>{counts.area}</ProfileInfoValue>
				</ProfileData>

				<ProfileData>
					<ProfileInfoTitle>{t('userContext.auditsMade')}</ProfileInfoTitle>
					<ProfileInfoValue>{counts.audit}</ProfileInfoValue>
				</ProfileData>
			</ProfileDatas>
			<MenuItems>
				<MenuItem onClick={() => setIsSettingsActive(true)}>
					<SettingsIcon />
					<MenuText>{t('userContext.settings')}</MenuText>
				</MenuItem>
				<MenuItem onClick={toggleDarkmode}>
					<MoonIcon />
					<MenuText>
						{user.theme === 'light'
							? t('userContext.turnOnDarkMode')
							: t('userContext.turnOffDarkMode')}
					</MenuText>
				</MenuItem>
				<Separator />
				<MenuItemLink as='a' target='_blank' href='https://goleansigma.canny.io/general'>
					<FeedbackIcon />
					<MenuText>{t('userContext.feedback')}</MenuText>
				</MenuItemLink>
				<MenuItemLink
					as='a'
					target='_blank'
					href='https://goleansigma.canny.io/feature-requests'>
					<RequestFeatureIcon />
					<MenuText>{t('userContext.requestFeature')}</MenuText>
				</MenuItemLink>
				<Separator />
				<MenuItem onClick={() => logout()} danger>
					<LogoutIcon />
					<MenuText isDanger>{t('userContext.ucSettings.logout')}</MenuText>
				</MenuItem>
			</MenuItems>
		</Wrapper>
	)
}

const Wrapper = styled(Card)<{ isActive: boolean }>`
	border-radius: 0;
	border: 0;
	box-shadow: 0 20px 66px 0 rgba(34, 48, 73, 0.2);
	display: ${(props) => (props.isActive ? 'flex' : 'none')};
	flex-direction: column;
	height: 100vh;
	left: 0;
	margin-top: 0;
	overflow: auto;
	padding: 0;
	position: fixed;
	right: 0;
	top: 0;
	width: 100vw;
	z-index: 10000;
	@media screen and (min-width: 768px) {
		border-radius: ${(props) => props.theme.radius.medium};
		border: 1px solid ${(props) => props.theme.colors.neutral005};
		height: auto;
		left: unset;
		margin-top: 40px;
		position: absolute;
		right: 0;
		top: unset;
		width: 320px;
	}
`

const UserWrapper = styled.div`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	display: flex;
	padding: 15px;
	margin: 15px;
`

const ProfileInfo = styled.div<{ withPadding?: boolean }>`
	display: flex;
	flex-direction: column;
	padding: ${(props) => (props.withPadding ? '10px' : 0)};
	margin-right: auto;
`

const ProfileName = styled.div`
	font-size: 18px;
	font-weight: 700;
	line-height: 20px;
	margin-bottom: 5px;
`

const ProfileNameText = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 14px;
	font-weight: 400;
	line-height: 16px;
`
const ProfileInfoValue = styled.div`
	font-size: 24px;
	font-weight: 700;
	line-height: 20px;
	margin-bottom: 5px;
`

const ProfileInfoTitle = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 10px;
	font-weight: 700;
	line-height: 16px;
	text-transform: uppercase;
	letter-spacing: 0.06em;
	margin-bottom: 7px;
`

const Close = styled.button`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral000};
	border-radius: ${(props) => props.theme.radius.round};
	border: none;
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	height: 25px;
	justify-content: center;
	padding: 0;
	width: 25px;
	&:hover {
		opacity: 0.75;
	}
	@media screen and (min-width: 768px) {
		display: none;
	}
`

const ProfileDatas = styled.div`
	display: flex;
	margin: 15px 15px 0;
	grid-gap: 20px;
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
`

const ProfileData = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 10px 15px 20px 15px;
	width: 80px;
`

export const MenuItems = styled.div`
	display: flex;
	flex-direction: column;
	margin: 20px;
`

const menuItemStyle = css`
	align-items: center;
	background: none;
	border-radius: ${(props) => props.theme.radius.medium};
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	display: flex;
	flex: 1;
	margin: none;
	padding: 15px 10px;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral005};
		opacity: 0.75;
	}

	&:active {
		opacity: 0.5;
	}

	& > svg {
		width: 20px;
	}
`

export const MenuItem = styled.button<{ danger?: boolean }>`
	${menuItemStyle}
	color: ${(props) =>
		props.danger ? props.theme.colors.danger : props.theme.colors.neutral000};
`

export const MenuItemLink = styled(Link)`
	${menuItemStyle}
`

export const MenuText = styled.span<{ isDanger?: boolean; isHighlighted?: boolean }>`
	color: ${(props) => {
		if (props.isDanger) {
			return props.theme.colors.danger
		}
		if (props.isHighlighted) {
			return props.theme.colors.primary
		}

		return props.theme.colors.neutral000
	}};
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 600;
	margin-left: 10px;
`

const Separator = styled.div`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	height: 5px;
	margin-bottom: 10px;
	margin-top: 10px;
	width: 100%;
`

export default UserContextMenu
