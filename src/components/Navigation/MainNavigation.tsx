import Button from '@system/Button'
import ClickOutside from 'components/ClickOutside'
import UserContextMenu from 'components/UserContextMenu'
import { ReactComponent as Logo } from 'images/logo.svg'
import { ReactComponent as LogoDynamic } from 'images/logoDynamic.svg'
import { useMeState } from 'providers/Me'
import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, NavLink as NaviLink } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { getInitials } from 'utils/helpers'

export type MainProps = {
	isApp?: boolean
	isFixed: boolean
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

const MainNavigation: FC<MainProps> = ({ isApp = false, isFixed, isOpen, setIsOpen }) => {
	const { t } = useTranslation('common')
	const user = useMeState()

	const [isContextOpen, setIsContextOpen] = useState<boolean>(false)
	const [isSettingsActive, setIsSettingsActive] = useState<boolean>(false)
	const intials = useMemo(() => getInitials(user), [user])

	if (isApp && !user.isLoggedIn) {
		localStorage.removeItem('token')
		return <Navigate to='/login' />
	}

	return (
		<Wrapper isFixed={isFixed}>
			<Nav isApp={isApp}>
				<LogoWrapper href='https://goleansigma.de'>
					{user.theme === 'dark' ? <LogoDynamic /> : <Logo />}
				</LogoWrapper>
				{user.isLoggedIn && (
					<NavLinks isFixed={isFixed}>
						<NavLink>
							<NaviLink to='/'>{t('nav.dashboard')}</NaviLink>
						</NavLink>
						{user.role === 1 && (
							<>
								<NavLink>
									<NaviLink to='/users'>Users</NaviLink>
								</NavLink>
								<NavLink>
									<NaviLink to='/questions'>Questions</NaviLink>
								</NavLink>
							</>
						)}
						<NavLink>
							<NaviLink to='/areas'>{t('nav.areas')}</NaviLink>
						</NavLink>
						<NavLink>
							<NaviLink to='/tasks'>{t('nav.tasks')}</NaviLink>
						</NavLink>
						<NavLink>
							<NaviLink to='/audits'>{t('nav.audits')}</NaviLink>
						</NavLink>
						<NavLink>
							<NaviLink to='/reports'>{t('nav.reports')}</NaviLink>
						</NavLink>
					</NavLinks>
				)}
				<Account>
					{user.isLoggedIn ? (
						<>
							<User
								onClick={() => {
									setIsContextOpen((isOpen) => !isOpen)
									setIsOpen(false)
								}}>
								<InitialProfileIcon>{intials}</InitialProfileIcon>
							</User>
							<ClickOutside
								onClickOutside={() => {
									setIsContextOpen(false)
									setIsSettingsActive(false)
								}}>
								<UserContextMenu
									isActive={isContextOpen}
									isSettingsActive={isSettingsActive}
									setIsSettingsActive={setIsSettingsActive}
									setIsContextOpen={setIsContextOpen}
								/>
							</ClickOutside>
						</>
					) : (
						<Entry>
							<Button to='/login' size='small' variant='link-light'>
								{t('nav.login')}
							</Button>
							<Button to='/signup' size='small'>
								{t('nav.signUp')}
							</Button>
						</Entry>
					)}
				</Account>

				<NavToggle
					isOpen={isOpen}
					onClick={() => {
						if (isOpen) {
							setIsOpen(false)
						} else {
							setIsOpen(true)
						}
					}}>
					<span></span>
					<span></span>
				</NavToggle>
			</Nav>
		</Wrapper>
	)
}
const Wrapper = styled.section<{ isFixed: boolean }>`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral006};
	display: flex;
	transition: all 250ms cubic-bezier(1, 0, 0, 1);
	width: 100%;
	${(props) =>
		props.isFixed &&
		css`
			box-shadow: ${(props) => props.theme.shadows.wide};
			height: 60px;
			left: 0;
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 1000;
		`}
`

const Nav = styled.nav<{ isApp: boolean }>`
	align-items: center;
	display: flex;
	max-width: 1600px;
	width: 100%;
	z-index: 1000;
`

const LogoWrapper = styled.a`
	background: none;
	color: ${(props) => props.theme.colors.neutral000};
	display: flex;
	flex-direction: column;
	margin-right: auto;
	padding: 20px 20px;
	width: 130px;
	overflow: visible;

	& > svg {
		height: 24px;
	}
`

const NavLink = styled.li<{ highlight?: boolean }>`
	padding: 0 15px;
	white-space: nowrap;
	font-family: ${(props) => props.theme.font.family.header};
	font-size: 1em;
	& > a {
		color: ${(props) =>
			props.highlight ? props.theme.colors.primary : props.theme.colors.neutral000};
		font-size: 1em;
		font-weight: 800;
		letter-spacing: 0.04em;
		padding: 3px 10px;
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		&:hover {
			color: ${(props) => props.theme.colors.neutral003};
			opacity: 1;
		}
		&.active {
			color: ${(props) => props.theme.colors.neutral000};
			&::after {
				content: '';
				height: 2px;
				width: 100%;
				position: absolute;
				bottom: -20px;
				background-color: ${(props) => props.theme.colors.primary};
			}
		}
	}
`

const NavLinks = styled.ul<{ center?: boolean; isFixed?: boolean }>`
	align-items: center;
	display: none;
	flex: ${(props) => (props.center ? '1' : '0')};
	list-style-type: none;
	padding-right: 20px;
	padding: 0;
	position: relative;
	${(props) =>
		props.center &&
		css`
			justify-content: center;
			align-self: center;
			margin-left: 160px;
		`}
	@media screen and (min-width: 1200px) {
		display: flex;
	}

	${(props) =>
		props.isFixed &&
		css`
			${NavLink} > a::after {
				bottom: -14px;
			}
		`}
`

const Account = styled.div`
	display: flex;
	align-items: center;
	position: relative;
	@media screen and (min-width: 992px) {
		margin: 0;
	}

	@media screen and (min-width: 1200px) {
		margin-right: 20px;
	}
`

const NavToggle = styled.div<{ isOpen: boolean }>`
	cursor: pointer;
	display: flex;
	flex-direction: column;
	padding: 10px 20px;
	& > span {
		background-color: ${(props) => props.theme.colors.neutral000};
		display: block;
		height: 2px;
		transform-origin: center;
		transform: translateY(-7px);
		transition: transform 250ms cubic-bezier(1, 0, 0, 1);
		width: 20px;
		&:first-child {
			transform: translateY(7px);
			${(props) =>
				props.isOpen &&
				css`
					margin-bottom: -2px;
					transform: rotate(45deg);
				`}
		}
		${(props) =>
			props.isOpen &&
			css`
				transform: rotate(-45deg);
			`}
	}

	@media screen and (min-width: 1200px) {
		display: none;
	}
`

const User = styled.button`
	background-color: ${(props) => props.theme.colors.neutral004};
	border-radius: 35px;
	cursor: pointer;
	display: flex;
	height: 35px;
	margin: 0;
	overflow: hidden;
	padding: 0;
	width: 35px;
	&:hover {
		opacity: 0.75;
	}
`

const InitialProfileIcon = styled.div`
	align-items: center;
	background: ${(props) => props.theme.colors.neutral005};
	border-radius: 35px;
	color: ${(props) => props.theme.colors.neutral000};
	display: flex;
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.h5};
	font-weight: 800;
	height: 35px;
	justify-content: center;
	text-transform: uppercase;
	width: 35px;
`

const Entry = styled.div`
	display: none;
	& > * {
		margin-left: 10px;
	}

	@media screen and (min-width: 1200px) {
		display: flex;
	}
`

export default MainNavigation
