import Button from '@system/Button'
import Input from '@system/Input'
import Textarea from '@system/Textarea'
import { createLocation, removeLocation, updateLocation } from 'api/Locations'
import ConfirmationMessage from 'components/ConfirmationMessage'
import Modal from 'components/Modal'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { useLocationsDispatch } from 'providers/Locations'
import { LocationProps, LocationsActions } from 'providers/Locations/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import React, {
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
import useLocationFormValidation from './Validation'
export type LocationFormProps = {
	initValue?: LocationProps
	isEdit: boolean
	isVisible: boolean
	setIsVisible: Dispatch<SetStateAction<boolean>>
}

const Form: FC<LocationFormProps> = ({ initValue, isEdit, isVisible, setIsVisible }) => {
	const { t } = useTranslation('common')
	const [description, setDescription] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [name, setName] = useState<string>('')

	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const initialErrors = {
		description: '',
		name: ''
	}

	const { errors, clearErrors, validateField } = useLocationFormValidation({
		initialErrors
	})

	const dispatch = useLocationsDispatch()
	const toastDispatch = useToastDispatch()

	/* eslint-disable */
	const clearForm = useCallback(() => {
		setDescription('')
		setName('')

		clearErrors()
	}, [])
	/* eslint-enable */

	useEffect(() => {
		clearForm()

		if (isEdit && initValue) {
			setName(`${initValue.name}`)
			setDescription(`${initValue.description}`)
		}

		return () => {
			clearForm()
		}
	}, [initValue, isEdit, clearForm])

	const onCreate = async () => {
		setIsLoading(true)

		try {
			const result = await createLocation({ name, description })

			if (!result?.data?.error) {
				const {
					data: { data: newLocation }
				} = result

				dispatch({
					type: LocationsActions.add,
					payload: {
						createdAt: newLocation.createAt,
						createdBy: {
							id: newLocation.created_by
						},
						description: newLocation.description,
						id: newLocation._id,
						name: newLocation.name,
						status: newLocation.status
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createLocation',
						text: result?.data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
				setIsLoading(false)
				setIsVisible(false)
			} else {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createLocation',
						text: result?.data?.message,
						type: ToastTypes.danger
					}
				})
				setIsLoading(false)
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
			const { data } = await updateLocation({ id: initValue?.id, name, description })

			if (!data?.error && initValue) {
				dispatch({
					type: LocationsActions.update,
					payload: {
						...initValue,
						name,
						description
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'updateLocation',
						text: data?.message,
						type: ToastTypes.info
					}
				})
				clearForm()
			}

			setIsLoading(false)
			setIsVisible(false)
		} catch (err) {
			console.error(err)
			setIsLoading(false)
			setIsVisible(false)
		}
	}

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()
		const isNameValid = validateField({ field: 'name', value: name })

		if (isNameValid) {
			if (isEdit) {
				onEdit()
			} else {
				onCreate()
			}
		}
	}

	const onRemove = async () => {
		if (!initValue) {
			return
		}

		try {
			setIsDeleteLoading(true)
			await removeLocation({ id: initValue.id, status: 0 })
			dispatch({ type: LocationsActions.remove, payload: initValue.id })
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
								values={{ location: initValue?.name }}></Trans>
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
					id: 'removeLocation',
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
				title={`${
					isEdit ? t('locations.form.title.update') : t('locations.form.title.create')
				}`}
				onClose={setIsVisible}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<Input
							error={errors.name}
							label={t('locations.form.inputs.name')}
							onChange={(e) => {
								validateField({
									field: 'name',
									value: e.currentTarget.value
								})
								setName(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({
									field: 'name',
									value: e.currentTarget.value
								})
							}}
							value={name}
						/>
						<Textarea
							label={t('locations.form.inputs.description')}
							onChange={(e) => setDescription(e.currentTarget.value)}
							value={description}
						/>

						<ActionWrapper>
							{!isEdit && (
								<Button type='submit' loading={isLoading}>
									<PlusIcon /> {t('locations.form.inputs.create')}
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
										{t('locations.form.inputs.delete')}
									</Button>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isLoading}
										type='submit'>
										<SaveIcon />
										{t('locations.form.inputs.save')}
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
