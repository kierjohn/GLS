import Button from '@system/Button'
import { ChecklistProps, getChecklists, removeChecklist } from 'api/Checklist'
import axios from 'axios'
import ConfirmationMessage from 'components/ConfirmationMessage'
import { ContextMenuItemProps } from 'components/ContextMenu'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import { ReactComponent as DocsIcon } from 'icons/docs.svg'
import { ReactComponent as EditIcon } from 'icons/edit.svg'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import MainLayout from 'layout/MainLayout'
import { map } from 'lodash'
import { Status, Statuses } from 'pages/Users'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import Form from './Form'

const Questions = () => {
	const { t } = useTranslation('common')
	const navigate = useNavigate()

	const [checklists, setChecklists] = useState()
	const [formValue, setFormValue] = useState<ChecklistProps>()
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
	const [isDeleteVisible, setIsDeleteVisible] = useState<boolean>(false)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const [lastReset, setLastReset] = useState<Date>(new Date())

	const onRemoveChecklist = async () => {
		if (!formValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeChecklist({ id: formValue.id })

			setIsDeleteLoading(false)
			setIsDeleteVisible(false)

			setLastReset(new Date())
		} catch (error) {
			console.error(error)
			setIsDeleteLoading(false)
		}
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

	const onEditItem = (value: ChecklistProps) => {
		setFormValue(value)
		setIsEdit(true)
		setIsFormVisible(true)
	}

	const menu: Array<ContextMenuItemProps> = [
		{
			text: 'View questions',
			icon: <DocsIcon />,
			onClick: (value: any) => {
				navigate(`/questions/${value.id}`)
			}
		},
		{
			text: t('locations.context.edit'),
			icon: <EditIcon />,
			onClick: onEditItem
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

	useEffect(() => {
		const fn = async () => {
			const source = axios.CancelToken.source()

			setIsLoading(true)
			try {
				const result = await getChecklists({
					source
				})

				const formattedResult: any = map(result.data.data, (item: any) => ({
					createdBy: item.created_by,
					id: item._id,
					code: item.code,
					isPublic: item.is_public,
					isShort: item.is_short,
					language: item.language,
					name: item.name,
					standard: item.standard,
					status: item.status,
					version: item.version,
					type: item.type
				}))

				setChecklists(formattedResult)
				setIsLoading(false)
			} catch (error) {
				console.error(error)
				setIsLoading(false)
			}
		}
		fn()
	}, [lastReset])

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Questions</title>
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
				onDone={onRemoveChecklist}
				onClose={onCloseConfirmation}
			/>

			<Form
				initValue={formValue}
				isEdit={isEdit}
				isVisible={isFormVisible}
				setIsVisible={setIsFormVisible}
				setLastReset={setLastReset}
			/>
			<Wrapper>
				{isLoading ? (
					<div>loading...</div>
				) : (
					<>
						<List
							action={
								<Button onClick={onCreateLocation} size='small' variant='primary'>
									<PlusIcon /> Create Checklist
								</Button>
							}
							hasPadding={false}
							data={checklists}
							isLoading={false}
							itemFormat={({
								code,
								name,
								version,
								language,
								createdBy,
								standard,
								isShort,
								type
							}) => {
								return (
									<>
										<Data
											value={name}
											text={
												<>
													{`${code} - `}
													<strong>v{version}</strong>
												</>
											}
											isBlocked
										/>
										<Data value={`by ${createdBy?.email}`} text='createdBy' />
										<Data
											isBlocked
											value={
												<Statuses>
													<Status title={language}>
														<StatusText>{language}</StatusText>
													</Status>
													<Status title={standard}>
														<StatusText>{standard}</StatusText>
													</Status>
													<Status title={type}>
														<StatusText>
															{type === 'production' && 'PROD'}
															{type === 'laboratory' && 'LAB'}
															{type === 'office' && 'OFC'}
														</StatusText>
													</Status>
													<Status title={isShort}>
														<StatusText>{isShort ? 'short' : ''}</StatusText>
													</Status>
												</Statuses>
											}
										/>
									</>
								)
							}}
							menu={menu}
							onListItemClick={(value: any) => navigate(`/questions/${value.id}`)}
							title='Checklists'
						/>
					</>
				)}
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	padding: 30px;
	height: 100%;
`

const StatusText = styled.div`
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	width: 40px;
`
export default Questions
