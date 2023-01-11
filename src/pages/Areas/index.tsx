import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { removeArea } from 'api/Areas'
import ConfirmationMessage from 'components/ConfirmationMessage'
import { ContextMenuItemProps } from 'components/ContextMenu'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import Pagination from 'components/Pagination'
import { PAGE_LIMIT } from 'Constants'
import { ReactComponent as ArrowTopRightIcon } from 'icons/arrowTopRight.svg'
import { ReactComponent as EditIcon } from 'icons/edit.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as ResultIcon } from 'icons/result.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import MainLayout from 'layout/MainLayout'
import { size } from 'lodash'
import { useAreasDispatch, useAreasState } from 'providers/Areas'
import { AreaActions, AreaProps } from 'providers/Areas/types'
import { useFetchFilteredAreas } from 'providers/Areas/useFetchFilteredAreas'
import { useLocationsState } from 'providers/Locations'
import { useFetchLocation } from 'providers/Locations/useFetchLocation'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import Filter from './Filter'
import Form from './Form'

const Areas: FC = () => {
	const { t } = useTranslation('common')
	const areaDispatch = useAreasDispatch()
	const navigate = useNavigate()
	const toastDispatch = useToastDispatch()

	const { count, data, isLoading } = useAreasState()
	const { data: locationData, isLoading: isLocationLoading } = useLocationsState()

	const [formValue, setFormValue] = useState<AreaProps>()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const limit = PAGE_LIMIT

	const [sort, setSort] = useState<string>('createdAt')
	const [order, setOrder] = useState<string>('desc')
	const [search, setSerch] = useState<string>('')
	const [type, setType] = useState<string>('all')
	const [isFilterDefault, setIsFilterDefault] = useState<boolean>(true)

	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const menu: Array<ContextMenuItemProps> = [
		{
			text: t('areas.context.viewReport'),
			icon: <ResultIcon />,
			onClick: (value: AreaProps) => navigate(`/reports/${value.id}`)
		},
		{
			text: t('areas.context.edit'),
			icon: <EditIcon />,
			onClick: (value: AreaProps) => {
				setFormValue(value)
				setIsEdit(true)
				setIsFormVisible(true)
			}
		},
		{
			text: t('areas.context.delete'),
			icon: <TrashIcon />,
			onClick: (value: AreaProps) => {
				setFormValue(value)
				setIsDeleteConfirmationVisible(true)
			}
		}
	]

	useFetchFilteredAreas({ limit, order, page, search, sort, type })
	useFetchLocation()

	const onRemoveLocation = async () => {
		if (!formValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			const result = await removeArea({ id: formValue.id, status: 0 })

			if (result.data.error) {
				setIsDeleteLoading(false)

				return toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'removeArea',
						text: String(result.data.message),
						type: ToastTypes.danger
					}
				})
			}

			areaDispatch({ type: AreaActions.remove, payload: formValue.id })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeArea',
					text: (
						<>
							<Trans
								t={t}
								i18nKey='areas.toast.deleted'
								components={[<strong />]}
								values={{ area: formValue.title }}></Trans>
						</>
					),
					type: ToastTypes.danger
				}
			})
		} catch (error) {
			console.error(error)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeArea',
					text: String(error),
					type: ToastTypes.danger
				}
			})
		}
		setIsDeleteLoading(false)
		setIsDeleteConfirmationVisible(false)
	}

	const onCloseConfirmation = () => {
		setIsDeleteConfirmationVisible(false)
	}

	const onCreateArea = () => {
		setIsEdit(false)
		setIsFormVisible(true)
		setFormValue(undefined)
	}

	const onEditItem = (value: AreaProps) => {
		setFormValue(value)
		setIsEdit(true)
		setIsFormVisible(true)
	}

	useEffect(() => {
		if (
			order === 'desc' &&
			sort === 'createdAt' &&
			type === 'all' &&
			search.length === 0
		) {
			setIsFilterDefault(true)
		} else {
			setIsFilterDefault(false)
		}
	}, [sort, type, search, order])

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Areas</title>
			</Helmet>
			<ConfirmationMessage
				confirmText={formValue?.title}
				doneIcon={<TrashIcon />}
				doneText={t('confirmation.doneText')}
				isDanger={true}
				isLoading={isDeleteLoading}
				isVisible={isDeleteConfirmationVisible}
				message={
					<>
						<p>
							<strong>{t('confirmation.message.strong')} </strong>{' '}
							{t('confirmation.message.text', { item: t('areas.item') })}
						</p>
						<br />
						<p>
							<Trans
								t={t}
								i18nKey='confirmation.message.typeToContinue'
								components={[<strong />]}
								values={{ value: formValue?.title }}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: t('areas.item') })}
				onDone={onRemoveLocation}
				onClose={onCloseConfirmation}
			/>
			<Form
				initValue={formValue}
				isEdit={isEdit}
				isVisible={isFormVisible}
				setIsVisible={setIsFormVisible}
			/>
			<Wrapper>
				<Filter
					search={search}
					sort={sort}
					order={order}
					type={type}
					setSort={setSort}
					setOrder={setOrder}
					setSearch={setSerch}
					setType={setType}
				/>
				<AreaWrapper>
					<List
						action={
							Boolean(size(locationData)) ? (
								<Button onClick={onCreateArea} size='small'>
									<PlusIcon /> {t('areas.action.create')}
								</Button>
							) : (
								<Button to='/locations' size='small'>
									<ArrowTopRightIcon /> {t('areas.action.manageLocations')}
								</Button>
							)
						}
						data={data}
						emptyStateAction={
							Boolean(size(locationData)) ? (
								<>
									{isFilterDefault && (
										<Button onClick={onCreateArea} variant='light'>
											<PlusIcon /> {t('areas.action.create')}
										</Button>
									)}
								</>
							) : (
								<Button to='/locations' variant='light'>
									<ArrowTopRightIcon />
									{t('areas.action.manageLocations')}
								</Button>
							)
						}
						emptyStatetext={
							Boolean(size(locationData)) ? (
								<>
									{!isFilterDefault ? (
										<>
											<H as='h4'>{t('area.emptyState.noResult')}</H>
										</>
									) : (
										<>
											<H as='h4'>{t('areas.emptyState.title')}</H>
											<Text>{t('areas.emptyState.title')}</Text>
										</>
									)}
								</>
							) : (
								<>
									<H as='h4'>{t('areas.emptyState.location.title')}</H>
									<Text>{t('areas.emptyState.location.text')}</Text>
								</>
							)
						}
						ghostLoading={{
							dataCount: 3,
							itemCount: 4
						}}
						isLoading={isLoading || isLocationLoading}
						menu={menu}
						title={t('areas.title')}
						itemFormat={(value) => (
							<>
								<Data
									value={value.title}
									text={value.description ? value.description : '-'}
									isBlocked={true}
								/>
								<Data
									desktopOnly
									value={value.type}
									text={t('areas.data.type')}
									isCapitalized
								/>
								{/* <Data
									desktopOnly
									value={value.location.name}
									text={t('areas.data.location')}
								/> */}
							</>
						)}
						onListItemClick={onEditItem}
					/>
					<Pagination count={count} limit={limit} page={page} setPage={setPage} />
				</AreaWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	width: 100%;
`
const AreaWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	@media screen and (min-width: 992px) {
		margin-left: 300px;
	}
`
export default Areas
