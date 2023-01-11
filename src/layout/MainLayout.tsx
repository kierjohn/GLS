import Button from '@system/Button'
import H from '@system/H'
import Input from '@system/Input'
import Text from '@system/Text'
import { updateProfile } from 'api/Profile'
import { sendEmailVerification } from 'api/Users'
import axios from 'axios'
import { EntryCard, FormWrapper, Header, MainWrapper } from 'components/EntryStyles'
import Footer from 'components/Footer'
import Loader from 'components/Loader'
import Modal from 'components/Modal'
import Navigation from 'components/Navigation'
import NavLogo from 'components/Navigation/NavLogo'
import { ReactComponent as ArrowTopRightIcon } from 'icons/arrowTopRight.svg'
import { ReactComponent as BigCheckIcon } from 'icons/bigCheck.svg'
import { ReactComponent as GiftIcon } from 'icons/gift.svg'
import { isEmpty, isNil } from 'lodash'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, ReactNode, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation, useMatch } from 'react-router-dom'
import styled from 'styled-components/macro'
import { logout } from 'utils/helpers'
import { ReactComponent as Logo } from 'images/logo.svg'

ReactGA.initialize(`${process.env.GOOGLE_ANALYTICS_TRACKING_ID}`)

export type MainLayoutProps = {
	hasNav?: boolean
	isApp?: boolean
	isChildWrapped?: boolean
	isNavLogo?: boolean
	isVerification?: boolean
	navLogoActions?: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({
	children,
	hasNav = true,
	isApp,
	isChildWrapped = true,
	isNavLogo,
	isVerification,
	navLogoActions
}) => {
	const { t } = useTranslation('common')
	const dispatch = useMeDispatch()
	const path = useMatch('locations')
	const user = useMeState()
	const toastDispatch = useToastDispatch()
	const location = useLocation()

	const [title, setTitle] = useState<string>(t('main.initForm.title').toString())
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isResendLoading, setIsResendLoading] = useState<boolean>(false)
	const [isNotifyLoading, setIsNotifyLoading] = useState<boolean>(false)
	const [errors, setErrors] = useState<{ firstname: string; lastname: string }>({
		firstname: '',
		lastname: ''
	})

	const [firstname, setFirstname] = useState<string>('')
	const [lastname, setLastname] = useState<string>('')

	const onResendVerification = async () => {
		setIsResendLoading(true)

		const source = axios.CancelToken.source()
		try {
			const verification = await sendEmailVerification({
				email: user.email,
				source
			})

			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'errorResendVerification',
					text: String(verification.data.message),
					type: ToastTypes.info
				}
			})
			setIsResendLoading(false)
		} catch (error: any) {
			console.error(error)
			setIsResendLoading(false)
		}
	}
	const onUpdateProfile = async (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		if (!lastname) {
			setErrors({ ...errors, lastname: 'Lastname is required.' })
		}

		if (!firstname) {
			setErrors({ ...errors, firstname: 'Firstname is required.' })
		}

		if (!firstname || !lastname) {
			setIsLoading(false)
			return
		}

		try {
			dispatch({ type: MeActions.updateLoading, payload: true })
			const res = await updateProfile({ firstname, lastname })

			dispatch({ type: MeActions.updateLoading, payload: false })
			if (!res.data.error) {
				dispatch({
					type: MeActions.update,
					payload: {
						...user,
						firstname,
						lastname
					}
				})
				setTitle('')
				setCurrentPage(1)
				setIsVisible(true)
			} else {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'profileUpdateError',
						text: `something went wrong: ${res.data.error}`,
						type: ToastTypes.danger
					}
				})
			}

			setIsLoading(false)
		} catch (err) {
			setIsLoading(false)
			dispatch({ type: MeActions.updateLoading, payload: false })
			console.error(err)
		}
	}

	const notifySupport = async () => {
		setIsNotifyLoading(true)
		try {
			await updateProfile({ issues: true })

			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'notifySupport',
					text: t('verify.notifySuccess'),
					type: ToastTypes.info
				}
			})
			setIsNotifyLoading(false)
		} catch (error: any) {
			console.error(error)
			setIsNotifyLoading(false)
		}
	}

	//google analytics setup
	useEffect(() => {
		ReactGA.pageview(location.pathname + location.search)
	}, [location])

	useEffect(() => {
		if (!user.isLoading) {
			setIsVisible(isEmpty(user.firstname) && isEmpty(user.lastname))
		}
	}, [user.firstname, user.lastname, user.isLoading])

	//uncanny setup
	useEffect(() => {
		;(window as any).Canny('identify', {
			appID: '6243c50ef8400752853eb3c4',
			user: {
				email: user.email,
				name: `${user.firstname} ${user.lastname}`,
				id: user.id,
				avatarURL: `https://api.goleansigma.de/public/images/user/${user.id}`,
				created: new Date().toISOString()
			}
		})
	}, [user.firstname, user.lastname, user.email, user.id])

	if (!user.isLoading && !isVerification && !user.verified && user.isLoggedIn) {
		return (
			<Wrapper>
				<ChildrenWrapper isApp={isApp} hasNav={hasNav} isVerified={user?.verified}>
					<MainWrapper>
						<EntryCard>
							<LogoWrapper>
								<Logo />
							</LogoWrapper>
							<Header>
								<H as='h3' weight='800'>
									{t('verify.text')}
								</H>
							</Header>
							<FormWrapper>
								<FormText>
									<Trans
										t={t}
										i18nKey='verify.description'
										components={[<a href='mailto: support@goleansigma.de'> </a>]}></Trans>
								</FormText>

								<ButtonWrapper>
									<Button
										onClick={onResendVerification}
										isBlocked
										loading={isResendLoading}>
										{t('verify.resend')}
									</Button>
									<Button variant='light' isBlocked onClick={() => logout()}>
										{t('verify.close')}
									</Button>
								</ButtonWrapper>
								<Button
									variant='link'
									isBlocked
									onClick={() => notifySupport()}
									loading={isNotifyLoading}>
									{t('verify.notifySupport')}
								</Button>
							</FormWrapper>
						</EntryCard>
					</MainWrapper>
				</ChildrenWrapper>
			</Wrapper>
		)
	}

	return (
		<Wrapper>
			{hasNav && (
				<>
					{isNavLogo ? (
						<NavLogo actions={navLogoActions} />
					) : (
						<Navigation isApp={isApp} />
					)}
				</>
			)}

			{isChildWrapped ? (
				<ChildrenWrapper isApp={isApp} hasNav={hasNav} isVerified={user?.verified}>
					{children}
					{hasNav && !isNavLogo && <Footer isApp={isApp} />}
				</ChildrenWrapper>
			) : (
				<>
					{children}
					{hasNav && !isNavLogo && <Footer isApp={isApp} />}
				</>
			)}

			{!user.isLoading ? (
				<>
					{Boolean(isApp) && isVisible && (
						<Modal isVisible={Boolean(isApp) && isVisible} title={title}>
							{currentPage === 0 && (
								<InitForm>
									<form onSubmit={onUpdateProfile}>
										<Input
											label={t('main.initForm.firstname')}
											value={firstname}
											error={errors.firstname}
											onChange={(e) => setFirstname(e.currentTarget.value)}
											onBlur={(e) => {
												if (!e.currentTarget.value) {
													setErrors({ ...errors, firstname: 'Firstname is required' })
												} else {
													setErrors({ ...errors, firstname: '' })
												}
											}}
										/>
										<Input
											label={t('main.initForm.lastname')}
											value={lastname}
											error={errors.lastname}
											onChange={(e) => setLastname(e.currentTarget.value)}
											onBlur={(e) => {
												if (!e.currentTarget.value) {
													setErrors({ ...errors, lastname: 'Lastname is required' })
												} else {
													setErrors({ ...errors, lastname: '' })
												}
											}}
										/>
										<InitFormAction>
											<Button width='180px' type='submit' loading={isLoading}>
												{t('main.initForm.getStarted')}
											</Button>
										</InitFormAction>
									</form>
								</InitForm>
							)}
							{currentPage === 1 && (
								<FreeTrial>
									<FreeTrialIcon>
										<GiftIcon />
									</FreeTrialIcon>
									<H as='h3'>{t('main.freeTrial.title')}</H>
									<FreeTrialText>{t('main.freeTrial.text')}</FreeTrialText>
									<Button width='200px' onClick={() => setCurrentPage(2)}>
										{t('main.freeTrial.continue')}
									</Button>
								</FreeTrial>
							)}
							{currentPage === 2 && (
								<AllSet>
									<AllSetIcon>
										<BigCheckIcon />
									</AllSetIcon>
									<H as='h3'>{t('main.initForm.allSet')}</H>
									<AllSetText>{t('main.initForm.allSetText')}</AllSetText>
									<Button
										width='200px'
										variant='link'
										onClick={() => setIsVisible(false)}>
										{t('main.initForm.skip')}
									</Button>
									{isNil(path) && (
										<Button width='200px' to='/areas'>
											<ArrowTopRightIcon />
											{t('main.initForm.manageLocations')}
										</Button>
									)}
									{!isNil(path) && (
										<Button
											width='200px'
											onClick={() => setIsVisible(false)}
											loading={isNotifyLoading}>
											<ArrowTopRightIcon />
											{t('main.initForm.manageLocations')}
										</Button>
									)}
								</AllSet>
							)}
						</Modal>
					)}
				</>
			) : (
				<Loader />
			)}
		</Wrapper>
	)
}

const Wrapper = styled.section`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
`

const Notification = styled.div`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral000};
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	justify-content: center;
	padding: 10px 20px;
	font-weight: 600;
	z-index: 10000;
	& > span {
		flex: 1;
	}
	& > button {
		margin-left: 10px;
	}
`

const GhostButton = styled.button`
	background: none;
	border: 1px solid ${(props) => props.theme.colors.neutral001};
	color: ${(props) => props.theme.colors.neutral001};
	padding: 5px 10px;
	border-radius: ${(props) => props.theme.radius.round};
	cursor: pointer;
	margin-left: auto;
	&:hover {
		opacity: 0.75;
	}
`

const ChildrenWrapper = styled.section<{
	isApp?: boolean
	hasNav?: boolean
	isVerified: boolean
}>`
	display: flex;
	flex-direction: column;
	flex: 1;
	max-width: 1600px;
	width: 100%;
	min-height: ${(props) =>
		props.isVerified ? 'calc(100vh - 143px' : 'calc(100vh - 191px'});
`

const InitForm = styled.div`
	& > form > * {
		margin-bottom: 20px;
	}
`
const InitFormAction = styled.div`
	width: 100%;
	& > * {
		margin-left: auto;
	}
`

const FreeTrial = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	& > button {
		margin-bottom: 10px;
	}
`
const FreeTrialIcon = styled.div`
	color: ${(props) => props.theme.colors.success};
	margin-bottom: 40px;
	margin-top: 20px;
`

const FreeTrialText = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
	text-align: center;
	margin-bottom: 40px;
`

const AllSet = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	& > button {
		margin-bottom: 10px;
	}
`

const AllSetIcon = styled.div`
	color: ${(props) => props.theme.colors.success};
	margin-bottom: 40px;
	margin-top: 20px;
`

const AllSetText = styled(Text)`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
	text-align: center;
	margin-bottom: 40px;
`

const FormText = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
	padding-bottom: 40px;
`

const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	grid-gap: 10px;
	margin-bottom: 20px;
`

const LogoWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding-top: 40px;
`

export default MainLayout
