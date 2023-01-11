import Button from '@system/Button'
import Checkbox from '@system/Checkbox'
import Input from '@system/Input'
import Select from '@system/Select'
import {
	ChecklistProps,
	createChecklist,
	removeChecklist,
	updateChecklist
} from 'api/Checklist'
import ConfirmationMessage from 'components/ConfirmationMessage'
import Modal from 'components/Modal'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import {
	Dispatch,
	FC,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useState
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export type ChecklistFormProps = {
	initValue?: ChecklistProps
	isEdit: boolean
	isVisible: boolean
	setIsVisible: Dispatch<SetStateAction<boolean>>
	setLastReset: Dispatch<SetStateAction<Date>>
}

const Form: FC<ChecklistFormProps> = ({
	initValue,
	isEdit,
	isVisible,
	setIsVisible,
	setLastReset
}) => {
	const { t } = useTranslation('common')
	const [name, setName] = useState<string>('')
	const [isPublic, setIsPublic] = useState<boolean>(false)
	const [isShort, setIsShort] = useState<boolean>(false)
	const [version, setVersion] = useState<string>('')
	const [language, setLanguage] = useState<string>('')
	const [standard, setStandard] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [code, setCode] = useState<string>('')

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const toastDispatch = useToastDispatch()

	/* eslint-disable */
	const clearForm = useCallback(() => {
		setIsPublic(false)
		setIsShort(false)
		setVersion('')
		setLanguage('')
		setStandard('')
		setName('')
		setType('')
		setCode('')
	}, [])
	/* eslint-enable */

	useEffect(() => {
		clearForm()

		if (isEdit && initValue) {
			setCode(initValue?.code)
			setIsPublic(initValue?.isPublic)
			setIsShort(initValue?.isShort)
			setLanguage(initValue?.language)
			setName(initValue?.name)
			setStandard(initValue?.standard)
			setType(initValue?.type)
			setVersion(initValue?.version)
		}

		return () => {
			clearForm()
		}
	}, [initValue, isEdit, clearForm])

	const onCreate = async () => {
		setIsLoading(true)

		try {
			const result = await createChecklist({
				name,
				isPublic,
				isShort,
				version,
				language,
				standard,
				type,
				code
			})

			if (!result?.data?.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createChecklist',
						text: result?.data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
				setIsLoading(false)
				setIsVisible(false)
				setLastReset(new Date())
			} else {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createChecklist',
						text: result?.data?.message,
						type: ToastTypes.danger
					}
				})
				setIsLoading(false)
				setLastReset(new Date())
			}
		} catch (err) {
			console.error(err)
			setIsLoading(false)
			setIsVisible(false)
		}
	}

	const onEdit = async () => {
		setIsLoading(true)

		try {
			const { data } = await updateChecklist({
				id: initValue?.id,
				name,
				isPublic,
				isShort,
				version,
				language,
				standard,
				type,
				code
			})

			if (!data?.error && initValue) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'updateChecklist',
						text: data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
			}

			setIsLoading(false)
			setIsVisible(false)
			setLastReset(new Date())
		} catch (err) {
			console.error(err)
			setIsLoading(false)
			setIsVisible(false)
		}
	}

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()
		if (isEdit) {
			onEdit()
		} else {
			onCreate()
		}
	}

	const onRemove = async () => {
		if (!initValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeChecklist({ id: initValue.id, status: 0 })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeChecklist',
					text: `${initValue.name} has been successfully removed from the checklist`,
					type: ToastTypes.danger
				}
			})
			setLastReset(new Date())
		} catch (error) {
			console.error(error)
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeChecklist',
					text: String(error),
					type: ToastTypes.danger
				}
			})
		}
		setIsDeleteLoading(false)
		setIsDeleteConfirmationVisible(false)
	}

	const onConfirmationClose = () => {
		setIsDeleteConfirmationVisible(false)
		setIsVisible(true)
	}

	return (
		<>
			<Modal
				title={`${isEdit ? 'Update Checklist' : 'Create Checklist'}`}
				onClose={setIsVisible}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<Input
							label='Name'
							onChange={(e) => {
								setName(e.currentTarget.value)
							}}
							value={name}
						/>

						<Input
							label='Code'
							onChange={(e) => {
								setCode(e.currentTarget.value)
							}}
							value={code}
						/>

						<Input
							label='Standard'
							onChange={(e) => {
								setStandard(e.currentTarget.value)
							}}
							value={standard}
						/>

						<Select
							label='Language'
							value={language}
							onChange={(e) => setLanguage(e.currentTarget.value)}>
							<option value='en'>EN - English</option>
							<option value='de'>DE - German</option>
						</Select>

						<Input
							label='Version'
							onChange={(e) => {
								setVersion(e.currentTarget.value)
							}}
							value={version}
						/>

						<Select
							label='Type'
							value={type}
							onChange={(e) => setType(e.currentTarget.value)}>
							<option value='office'>Office</option>
							<option value='production'>Production</option>
							<option value='laboratory'>Laboratory</option>
						</Select>

						<Checkbox
							value={isShort}
							onCheck={() => setIsShort(!isShort)}
							label='Short audit'
							description=''
						/>

						<ActionWrapper>
							{!isEdit && (
								<Button type='submit' loading={isLoading}>
									<PlusIcon /> Add Checklist
								</Button>
							)}
							{isEdit && initValue && (
								<>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isDeleteLoading}
										variant='danger-ghost'
										onClick={() => {
											setIsVisible(false)
											setIsDeleteConfirmationVisible(true)
										}}>
										<TrashIcon />
										Delete
									</Button>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isLoading}
										type='submit'>
										<SaveIcon />
										Save changes
									</Button>
								</>
							)}
						</ActionWrapper>
					</Wrapper>
				</form>
			</Modal>
			<ConfirmationMessage
				confirmText={initValue?.name}
				doneIcon={<TrashIcon />}
				doneText={t('confirmation.doneText')}
				isDanger={true}
				isLoading={isDeleteLoading}
				isVisible={isDeleteConfirmationVisible}
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
								values={{ value: initValue?.name }}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: t('locations.item') })}
				onDone={onRemove}
				onClose={onConfirmationClose}
			/>
		</>
	)
}

const Wrapper = styled.div`
	& > * {
		margin-bottom: 20px;
	}
`

const ActionWrapper = styled.div`
	display: flex;
	margin-top: 40px;
	& > * {
		flex-shrink: 1;
		padding: 10px 20px;
		&:first-child {
			margin-right: 10px;
			margin-left: auto;
		}
	}
`

export default Form
