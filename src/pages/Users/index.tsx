import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { PAGE_LIMIT } from 'Constants'
import { getUserReports, removeUser } from 'api/Users'
import Card from 'components/Card'
import ConfirmationMessage from 'components/ConfirmationMessage'
import { ContextMenuItemProps } from 'components/ContextMenu'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import Pagination from 'components/Pagination'
import { ReactComponent as AdminIcon } from 'icons/admin.svg'
import { ReactComponent as CheckIcon } from 'icons/checkCircle.svg'
import { ReactComponent as CopyIcon } from 'icons/copy.svg'
import { ReactComponent as EditIcon } from 'icons/edit.svg'
import { ReactComponent as IssueIcon } from 'icons/issue.svg'
import { ReactComponent as LogoutIcon } from 'icons/logout.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as TestIcon } from 'icons/test.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { ReactComponent as UserIcon } from 'icons/user.svg'
import MainLayout from 'layout/MainLayout'
import { DateTime } from 'luxon'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { useUsersDispatch, useUsersState } from 'providers/Users'
import { UserActions, UserProps } from 'providers/Users/types'
import { useFetchFilteredUsers } from 'providers/Users/useFetchFilteredUsers'
import { FC, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Filter from './Filter'
import Form from './Form'

const Users: FC = () => {
	const { t } = useTranslation('common')

	const dispatch = useUsersDispatch()
	const toastDispatch = useToastDispatch()

	const { count, data, isLoading } = useUsersState()
	const [formValue, setFormValue] = useState<UserProps>()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const limit = PAGE_LIMIT

	const [order, setOrder] = useState<string>('desc')
	const [role, setRole] = useState<string>('')
	const [search, setSerch] = useState<string>('')
	const [sort, setSort] = useState<string>('')
	const [isVerified, setIsVerified] = useState<string>('all')
	const [hasIssues, setHasIssues] = useState<string>('all')
	const [userReport, setUserReport] = useState({
		totalUsers: 0,
		subscribeUsers: 0,
		regularUsers: 0,
		verifiedUsers: 0,
		issues: 0
	})

	const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const menu: Array<ContextMenuItemProps> = [
		{
			text: 'Login as',
			icon: <LogoutIcon />,
			onClick: () => {}
		},
		{
			text: 'Copy Verification link',
			icon: <CopyIcon />,
			onClick: (value) => {
				if (
					DateTime.fromJSDate(new Date(value.userTokenExpires)).isValid &&
					DateTime.fromJSDate(new Date(value.userTokenExpires)).diffNow('minutes')
						.minutes > 0
				) {
					navigator.clipboard.writeText(
						`https://app.goleansigma.de/verify/${value.userToken}`
					)

					toastDispatch({
						type: ToastActions.add,
						payload: {
							id: 'copyVerificationLink',
							text: `Link copied!`,
							type: ToastTypes.info
						}
					})
				} else {
					toastDispatch({
						type: ToastActions.add,
						payload: {
							id: 'copyVerificationLink',
							text: `No verification link available for this user.`,
							type: ToastTypes.info
						}
					})
				}
			}
		},
		{
			text: 'Edit User',
			icon: <EditIcon />,
			onClick: (value: any) => {
				setFormValue(value)
				setIsEdit(true)
				setIsFormVisible(true)
			}
		},
		{
			text: 'Delete User',
			icon: <TrashIcon />,
			onClick: (value: any) => {
				setFormValue(value)
				setIsDeleteVisible(true)
			}
		}
	]

	useFetchFilteredUsers({
		limit,
		order,
		page,
		role,
		search,
		sort,
		verified: isVerified,
		issues: hasIssues
	})

	const onRemoveUser = async () => {
		if (!formValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeUser({ id: formValue.id, status: '0' })
			dispatch({ type: UserActions.remove, payload: formValue.id })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeUser',
					text: `user with email ${formValue.email} has been removed`,
					type: ToastTypes.danger
				}
			})
		} catch (error) {
			console.error(error)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeUserError',
					text: String(error),
					type: ToastTypes.danger
				}
			})
		}
		setIsDeleteLoading(false)
		setIsDeleteVisible(false)
	}

	const onCloseConfirmation = () => {
		setIsDeleteVisible(false)
		setIsFormVisible(true)
	}

	const onCreateUser = () => {
		setIsEdit(false)
		setIsFormVisible(true)
		setFormValue(undefined)
	}

	const onEditItem = (value: UserProps) => {
		setFormValue(value)
		setIsEdit(true)
		setIsFormVisible(true)
	}

	const showStatuses = (value: UserProps) => {
		return (
			<Statuses>
				{value.role === 1 && (
					<Status title='Admin'>
						<AdminIcon />
					</Status>
				)}
				{value.verified && (
					<Status title='Verified'>
						<CheckIcon />
					</Status>
				)}

				{value.tester && (
					<Status title='Tester'>
						<TestIcon />
					</Status>
				)}

				{value.issues && (
					<Status title='Has issue'>
						<IssueIcon />
					</Status>
				)}
			</Statuses>
		)
	}

	useEffect(() => {
		const fn = async () => {
			try {
				const {
					data: { data: userReport }
				} = await getUserReports()

				setUserReport(userReport)
			} catch (error: any) {
				console.error(error)
			}
		}

		fn()
	}, [])
	return (
		<MainLayout isApp>
			<Helmet>
				<title>Users</title>
			</Helmet>
			<ConfirmationMessage
				confirmText={formValue?.email}
				doneIcon={<TrashIcon />}
				doneText='Delete'
				isDanger={true}
				isLoading={isDeleteLoading}
				isVisible={isDeleteVisible}
				message={
					<>
						<p>
							<strong>{t('confirmation.message.strong')} </strong>{' '}
							{t('confirmation.message.text', { item: 'user' })}
						</p>
						<br />
						<p>
							<Trans
								t={t}
								i18nKey='confirmation.message.typeToContinue'
								components={[<strong />]}
								values={{
									value: formValue?.email
								}}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: 'user' })}
				onDone={onRemoveUser}
				onClose={onCloseConfirmation}
			/>
			<Form
				isEdit={isEdit}
				isVisible={isFormVisible}
				setIsVisible={setIsFormVisible}
				initValue={formValue}
			/>
			<Wrapper>
				<Filter
					role={role}
					search={search}
					verified={isVerified}
					issues={hasIssues}
					setRole={setRole}
					setSearch={setSerch}
					setVerified={setIsVerified}
					setIssues={setHasIssues}
				/>
				<UserWrapper>
					<Overview>
						<OverviewCard>
							<IconTitle>
								<CheckIcon /> <H as='h1'>{userReport.verifiedUsers}</H>
							</IconTitle>
							<Text>Verified users</Text>
						</OverviewCard>

						<OverviewCard>
							<IconTitle>
								<IssueIcon /> <H as='h1'>{userReport.issues}</H>
							</IconTitle>
							<Text>Users with issue</Text>
						</OverviewCard>

						<OverviewCard>
							<IconTitle>
								<UserIcon /> <H as='h1'>{userReport.regularUsers}</H>
							</IconTitle>
							<Text>Regular users</Text>
						</OverviewCard>

						<OverviewCard>
							<IconTitle>
								<UserIcon /> <H as='h1'>{userReport.totalUsers}</H>
							</IconTitle>
							<Text>Total number of users</Text>
						</OverviewCard>
					</Overview>

					<List
						action={
							<Button onClick={onCreateUser} size='small'>
								<PlusIcon /> Create user
							</Button>
						}
						data={data}
						emptyStateAction={
							!Boolean(search) && (
								<Button onClick={onCreateUser} variant='light'>
									<PlusIcon /> Create user
								</Button>
							)
						}
						emptyStatetext={
							!Boolean(search) ? (
								<>
									<H as='h4'>No user found</H>
								</>
							) : (
								<>
									<H as='h4'>{t('users.emptyState.searchTitle')}</H>
									<Text>{t('users.emptyState.searchText')}</Text>
								</>
							)
						}
						isLoading={isLoading}
						menu={menu}
						title='Users'
						itemFormat={(value) => (
							<>
								<Data
									value={value.firstname ? `${value.firstname} ${value.lastname}` : '-'}
									text={value.email}
									isBlocked={true}
								/>
								<Data
									value={DateTime.fromJSDate(value.createdAt).toFormat('DD')}
									text='Joined date'
								/>
								<Data
									value={
										<>
											{DateTime.fromJSDate(new Date(value.userTokenExpires)).isValid &&
											DateTime.fromJSDate(new Date(value.userTokenExpires)).diffNow(
												'minutes'
											).minutes > 0 ? (
												<>
													<TokenExpiraction>
														{Math.floor(
															DateTime.fromJSDate(
																new Date(value.userTokenExpires)
															).diffNow('minutes').minutes / 60
														)}
														h{' '}
														{Math.round(
															DateTime.fromJSDate(
																new Date(value.userTokenExpires)
															).diffNow('minutes').minutes % 60
														)}
														m
													</TokenExpiraction>
												</>
											) : (
												<TokenExpiraction>Expired</TokenExpiraction>
											)}
										</>
									}
									text='Token'
								/>
								<Data value={showStatuses(value)} />
							</>
						)}
						onListItemClick={onEditItem}
						ghostLoading={{
							dataCount: 1,
							itemCount: 3
						}}
					/>
					<Pagination count={count} limit={limit} page={page} setPage={setPage} />
				</UserWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Overview = styled.div`
	display: grid;
	grid-column: span 3;
	grid-gap: 20px;
	grid-template-columns: repeat(4, 1fr);
	width: 100%;
	padding: 20px 20px 0 20px;
`

const OverviewCard = styled(Card)`
	border-radius: 10px;
	padding: 20px;
	margin-bottom: 0;
`

const IconTitle = styled.div`
	display: flex;
	align-items: center;
	grid-gap: 10px;

	& svg {
		height: 32px;
		width: auto;
	}
`

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: auto;
	width: 100%;
`

const UserWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	@media screen and (min-width: 992px) {
		margin-left: 300px;
	}
`

export const Statuses = styled.div`
	display: flex;
	& > * {
		margin-right: 20px;
	}
`

export const Status = styled.div`
	align-items: center;
	color: ${(props) => props.theme.colors.neutral000};
	display: flex;
	justify-content: center;
	& > svg {
		width: 20px;
		height: 20px;
	}
`

const TokenExpiraction = styled.div``
export default Users
