import AdminElement from 'components/AdminElement'
import CookieNotice from 'components/CookieNotice'
import Loader from 'components/Loader'
import PrivateElement from 'components/PrivateElement'
import PublicOnlyElement from 'components/PublicOnlyElement'
import Toast from 'components/Toast'
import GlobalStyle from 'GlobalStyle'
import i18next from 'i18next'
import Cookie from 'js-cookie'
import { isNil } from 'lodash'
import AppLink from 'pages/AppLink'
import Account from 'pages/Settings/Account'
import SixS from 'pages/Settings/Audit'
import Password from 'pages/Settings/Password'
import Personal from 'pages/Settings/Personal'
import { AreasProvider } from 'providers/Areas'
import { AuditsProvider } from 'providers/Audits'
import { LocationsProvider } from 'providers/Locations'
import { useMeState } from 'providers/Me'
import { useFetchMe } from 'providers/Me/useFetchMe'
import { TasksProvider } from 'providers/Tasks'
import { ToastProvider } from 'providers/Toast'
import { UsersProvider } from 'providers/Users'
import React, { Suspense, useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import theme from 'theme'
import common_de from './translations/de/common.json'
import common_en from './translations/en/common.json'

const AccountVerification = React.lazy(
	() => import('pages/ForgotPassword/AccountVerification')
)
const Areas = React.lazy(() => import('pages/Areas'))
const Audits = React.lazy(() => import('pages/Audits'))
const AuditDetails = React.lazy(() => import('pages/Audits/Details'))
const Dashboard = React.lazy(() => import('pages/Dashboard'))
const EmailVerification = React.lazy(
	() => import('pages/ForgotPassword/CodeVerification')
)
const FourOhFour = React.lazy(() => import('pages/FourOhFour'))
const Login = React.lazy(() => import('pages/Login'))
const Report = React.lazy(() => import('pages/Reports/Report'))
const Reports = React.lazy(() => import('pages/Reports'))
const ReportShare = React.lazy(() => import('pages/ReportShare'))
const ResetPassword = React.lazy(() => import('pages/ForgotPassword/UpdatePassword'))
const Settings = React.lazy(() => import('pages/Settings'))
const Share = React.lazy(() => import('pages/ReportShare/Share'))
const Signup = React.lazy(() => import('pages/Signup'))
const Tasks = React.lazy(() => import('pages/Tasks'))
const Verify = React.lazy(() => import('pages/Verify'))

//admins
const Questions = React.lazy(() => import('pages/Questions'))
const QuestionDetails = React.lazy(() => import('pages/Questions/Details'))
const Users = React.lazy(() => import('pages/Users'))

const App = () => {
	const user = useMeState()
	const cookieLanguage = Cookie.get('lng')
	const lng = useMemo(
		() => (user.isLoggedIn ? user.language : cookieLanguage),
		[user.isLoggedIn, user.language, cookieLanguage]
	)

	useFetchMe()
	useEffect(() => {
		i18next.init({
			interpolation: { escapeValue: false },
			returnEmptyString: false,
			lng,
			resources: {
				en: {
					common: common_en
				},
				de: {
					common: common_de
				}
			},
			fallbackLng: 'en'
		})
	}, [lng])

	return (
		<ThemeProvider theme={theme(!isNil(user.theme) ? user.theme : 'light')}>
			<GlobalStyle />
			<I18nextProvider i18n={i18next}>
				<ToastProvider>
					<main className='App'>
						<Suspense fallback={<Loader />}>
							<Routes>
								{/* public routes */}
								<Route
									path='/login'
									element={
										<PublicOnlyElement>
											<Login />
										</PublicOnlyElement>
									}
								/>
								<Route
									path='/signup'
									element={
										<PublicOnlyElement>
											<Signup />
										</PublicOnlyElement>
									}
								/>
								{/* public routes */}

								{/* public/private routes */}
								<Route
									path='/'
									element={
										<PrivateElement>
											<AreasProvider>
												<LocationsProvider>
													<AuditsProvider>
														<TasksProvider>
															<Dashboard />
														</TasksProvider>
													</AuditsProvider>
												</LocationsProvider>
											</AreasProvider>
										</PrivateElement>
									}
								/>
								<Route path='/email-verification' element={<EmailVerification />} />
								<Route path='/forgot-password' element={<AccountVerification />} />
								<Route path='/reset-password/:token' element={<ResetPassword />} />

								<Route
									path='/areas'
									element={
										<PrivateElement>
											<AreasProvider>
												<LocationsProvider>
													<Areas />
												</LocationsProvider>
											</AreasProvider>
										</PrivateElement>
									}
								/>
								<Route path='/audits'>
									<Route
										path=''
										element={
											<PrivateElement>
												<AreasProvider>
													<AuditsProvider>
														<Audits />
													</AuditsProvider>
												</AreasProvider>
											</PrivateElement>
										}
									/>
									<Route
										path=':id'
										element={
											<AuditsProvider>
												<AuditDetails />
											</AuditsProvider>
										}
									/>
								</Route>
								<Route
									path='/tasks'
									element={
										<PrivateElement>
											<AreasProvider>
												<LocationsProvider>
													<TasksProvider>
														<Tasks />
													</TasksProvider>
												</LocationsProvider>
											</AreasProvider>
										</PrivateElement>
									}
								/>
								<Route
									path='/reports'
									element={
										<PrivateElement>
											<AreasProvider>
												<AuditsProvider>
													<TasksProvider>
														<Reports />
													</TasksProvider>
												</AuditsProvider>
											</AreasProvider>
										</PrivateElement>
									}>
									<Route path=':id' element={<Report />} />
								</Route>
								<Route
									path='/r'
									element={
										<PrivateElement>
											<AreasProvider>
												<AuditsProvider>
													<TasksProvider>
														<ReportShare />
													</TasksProvider>
												</AuditsProvider>
											</AreasProvider>
										</PrivateElement>
									}>
									<Route path=':areaId/:userId/:standard' element={<Share />} />
								</Route>
								<Route
									path='/settings'
									element={
										<PrivateElement>
											<Settings />
										</PrivateElement>
									}>
									<Route
										path='personal'
										element={
											<PrivateElement>
												<Personal />
											</PrivateElement>
										}
									/>
									<Route
										path='account'
										element={
											<PrivateElement>
												<Account />
											</PrivateElement>
										}
									/>
									<Route
										path='password'
										element={
											<PrivateElement>
												<Password />
											</PrivateElement>
										}
									/>
									<Route
										path='sixs'
										element={
											<PrivateElement>
												<SixS />
											</PrivateElement>
										}
									/>
									{/* <Route
										path='subscription'
										element={
											<PrivateElement>
												<Subscription />
											</PrivateElement>
										}
									/> */}
								</Route>
								<Route path='verify/:token' element={<Verify />} />
								{/* private routes */}

								{/* private/admins pages */}
								<Route
									path='/questions'
									element={
										<AdminElement>
											<Questions />
										</AdminElement>
									}
								/>
								<Route
									path='/questions/:checklistId'
									element={
										<AdminElement>
											<QuestionDetails />
										</AdminElement>
									}
								/>
								<Route path='*' element={<FourOhFour />} />
								<Route
									path='/users'
									element={
										<AdminElement>
											<UsersProvider>
												<Users />
											</UsersProvider>
										</AdminElement>
									}
								/>
								<Route path='/goleansigmaapp' element={<AppLink />} />
							</Routes>
							<Toast /> {/* toast notification */}
							<CookieNotice /> {/* cookie notice */}
						</Suspense>
					</main>
				</ToastProvider>
			</I18nextProvider>
		</ThemeProvider>
	)
}

export default App
