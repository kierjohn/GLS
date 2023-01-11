import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { removeLocation } from 'api/Locations'
import ConfirmationMessage from 'components/ConfirmationMessage'
import { ContextMenuItemProps } from 'components/ContextMenu'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import Pagination from 'components/Pagination'
import { PAGE_LIMIT } from 'Constants'
import { ReactComponent as EditIcon } from 'icons/edit.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import MainLayout from 'layout/MainLayout'
import { useLocationsDispatch, useLocationsState } from 'providers/Locations'
import { LocationProps, LocationsActions } from 'providers/Locations/types'
import { useFetchFilteredLocations } from 'providers/Locations/useFetchFilteredLocations'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Filter from './Filter'
import Form from './Form'
const Locations: FC = () => {
	const { t } = useTranslation('common')

	const dispatch = useLocationsDispatch()
	const toastDispatch = useToastDispatch()

	const { count, data, isLoading } = useLocationsState()
	const [formValue, setFormValue] = useState<LocationProps>()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const limit = PAGE_LIMIT

	const [sort, setSort] = useState<string>('createdAt')
	const [order, setOrder] = useState<string>('desc')
	const [search, setSerch] = useState<string>('')

	const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const menu: Array<ContextMenuItemProps> = [
		{
			text: t('locations.context.edit'),
			icon: <EditIcon />,
			onClick: (value: any) => {
				setFormValue(value)
				setIsEdit(true)
				setIsFormVisible(true)
			}
		},
		{
			text: t('locations.context.delete'),
			icon: <TrashIcon />,
			onClick: (value: any) => {
				setFormValue(value)
				setIsDeleteVisible(true)
			}
		}
	]

	useFetchFilteredLocations({ limit, order, page, search, sort })

	const onRemoveLocation = async () => {
		if (!formValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeLocation({ id: formValue.id, status: 0 })
			dispatch({ type: LocationsActions.remove, payload: formValue.id })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeLocation',
					text: (
						<>
							<Trans
								t={t}
								i18nKey='locations.toast.deleted'
								components={[<strong />]}
								values={{ location: formValue.name }}></Trans>
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
					id: 'removeLocationError',
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

	const onCreateLocation = () => {
		setIsEdit(false)
		setIsFormVisible(true)
		setFormValue(undefined)
	}

	const onEditItem = (value: LocationProps) => {
		setFormValue(value)
		setIsEdit(true)
		setIsFormVisible(true)
	}

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Locations</title>
			</Helmet>
			<ConfirmationMessage
				confirmText={formValue?.name}
				doneIcon={<TrashIcon />}
				doneText={t('confirmation.doneText')}
				isDanger={true}
				isLoading={isDeleteLoading}
				isVisible={isDeleteVisible}
				message={
					<>
						<p>
							<strong>{t('confirmation.message.strong')} </strong>{' '}
							{t('confirmation.message.text', { item: t('locations.item') })}
						</p>
						<br />
						<p>
							<Trans
								t={t}
								i18nKey='confirmation.message.typeToContinue'
								components={[<strong />]}
								values={{ value: formValue?.name }}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: t('locations.item') })}
				onDone={onRemoveLocation}
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
					search={search}
					sort={sort}
					order={order}
					setSort={setSort}
					setOrder={setOrder}
					setSearch={setSerch}
				/>
				<AreaWrapper>
					<List
						action={
							<Button onClick={onCreateLocation} size='small'>
								<PlusIcon /> {t('locations.action.create')}
							</Button>
						}
						data={data}
						emptyStateAction={
							!Boolean(search) && (
								<Button onClick={onCreateLocation} variant='light'>
									<PlusIcon /> {t('locations.action.create')}
								</Button>
							)
						}
						emptyStatetext={
							!Boolean(search) ? (
								<>
									<H as='h4'>{t('locations.emptyState.title')}</H>
									<Text>{t('locations.emptyState.text')}</Text>
								</>
							) : (
								<>
									<H as='h4'>{t('locations.emptyState.searchTitle')}</H>
									<Text>{t('locations.emptyState.searchText')}</Text>
								</>
							)
						}
						isLoading={isLoading}
						menu={menu}
						title={t('locations.title')}
						itemFormat={(value) => (
							<>
								<Data
									value={value.name}
									text={value.description ? value.description : '-'}
									isBlocked={true}
								/>
							</>
						)}
						onListItemClick={onEditItem}
						ghostLoading={{
							dataCount: 1,
							itemCount: 3
						}}
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
	flex-direction: column;
	flex: 1;
`
export default Locations
