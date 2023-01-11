import Button from '@system/Button'
import Input from '@system/Input'
import Select from '@system/Select'
import Textarea from '@system/Textarea'
import { createArea, removeArea, updateArea } from 'api/Areas'
import axios from 'axios'
import ConfirmationMessage from 'components/ConfirmationMessage'
import Modal from 'components/Modal'
import Tooltip from 'components/Tooltip'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as CloseIcon } from 'icons/timesLarge.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { ReactComponent as UploadIcon } from 'icons/upload.svg'
import LaboratoryImage from 'images/area/laboratory.png'
import OfficeImage from 'images/area/office.png'
import ProductionImage from 'images/area/production.png'
import { find, isNil, trim } from 'lodash'
import { useAreasDispatch } from 'providers/Areas'
import { AreaActions, AreaProps } from 'providers/Areas/types'
import { useLocationsState } from 'providers/Locations'
import { LocationProps } from 'providers/Locations/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import {
	ChangeEvent,
	Dispatch,
	FC,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components/macro'
import useAreaFormValidation from './Validation'

export type AreaFormProps = {
	initValue?: AreaProps
	isEdit: boolean
	isVisible: boolean
	setIsVisible: Dispatch<SetStateAction<boolean>>
}

const Form: FC<AreaFormProps> = ({ initValue, isEdit, isVisible, setIsVisible }) => {
	const { t } = useTranslation('common')
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [description, setDescription] = useState<string>('')
	const [location, setLocation] = useState<string>('')
	const [title, setTitle] = useState<string>('')
	const [type, setType] = useState<string>('')
	const [image, setImage] = useState<string>('')
	const [fileImage, setFileImage] = useState<File | null>(null)

	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { data: locations } = useLocationsState()

	const initialErrors = {
		location: '',
		title: '',
		type: '',
		image: ''
	}

	const { errors, clearErrors, validateField } = useAreaFormValidation({
		initialErrors
	})

	const dispatch = useAreasDispatch()
	const toastDispatch = useToastDispatch()

	/* eslint-disable */
	const clearForm = useCallback(() => {
		setDescription('')
		setLocation('')
		setTitle('')
		setType('')
		setImage('')
		setFileImage(null)
		clearErrors()
	}, [])
	/* eslint-enable */

	useEffect(() => {
		clearForm()

		if (isEdit && initValue) {
			setDescription(initValue.description)
			setLocation(`${initValue.location?.id}`)
			setTitle(initValue.title)
			setType(initValue.type)
			setImage(initValue.image)
		}

		return () => {
			clearForm()
		}
	}, [initValue, isEdit, clearForm])

	const getLocation = (locationId: string): LocationProps | undefined => {
		const location = find(locations, (location) => location.id === locationId)

		return location
	}

	const onCreate = async () => {
		setIsLoading(true)

		try {
			const result = await createArea({
				description,
				image,
				locationId: locations[0].id,
				title,
				type
			})
			if (!result?.data?.error) {
				const {
					data: { data: newArea }
				} = result

				dispatch({
					type: AreaActions.add,
					payload: {
						createdBy: {
							id: newArea.created_by
						},

						createdAt: newArea.createdAt,
						description: trim(newArea.description),
						id: newArea._id,
						image: newArea.image,
						location: getLocation(newArea.location),
						status: newArea.status,
						title: trim(newArea.title),
						type: newArea.type
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createLocation',
						text: result?.data?.message,
						type: 'createLocation'
					}
				})
				clearForm()
			} else {
				setIsLoading(false)
				return toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'removeArea',
						text: String(result.data.message),
						type: ToastTypes.danger
					}
				})
			}
			setIsLoading(false)
			setIsVisible(false)
		} catch (err: any) {
			console.error(err)
			setIsLoading(false)

			return toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeArea',
					text: String(err?.message),
					type: ToastTypes.danger
				}
			})
		}
	}

	const onEdit = async () => {
		setIsLoading(true)

		try {
			const { data } = await updateArea({
				description: trim(description),
				id: initValue?.id,
				image,
				title: trim(title),
				type,
				locationId: locations[0].id
			})

			if (!data?.error && initValue) {
				const currentLocation = getLocation(locations[0].id)
				dispatch({
					type: AreaActions.update,
					payload: {
						...initValue,
						description,
						image,
						location: {
							description: currentLocation?.description,
							id: location,
							name: currentLocation?.name
						},
						title,
						type
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
			} else {
				setIsLoading(false)
				return toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'removeArea',
						text: String(data.message),
						type: ToastTypes.danger
					}
				})
			}

			setIsLoading(false)
			setIsVisible(false)
		} catch (err: any) {
			console.error(err)
			setIsLoading(false)

			return toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeArea',
					text: String(err?.message),
					type: ToastTypes.danger
				}
			})
		}
	}

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (isLoading) {
			return
		}

		const isTitleValid = validateField({ field: 'title', value: title })
		const isTypeValid = validateField({ field: 'type', value: type })
		const isLocationValid = validateField({ field: 'location', value: location })
		const isImageValid = validateField({ field: 'image', value: image })

		if (isTitleValid && isTypeValid && isLocationValid && isImageValid) {
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
			const result = await removeArea({ id: initValue.id, status: 0 })

			if (result.data.error) {
				return toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'removeArea',
						text: String(result.data.message),
						type: ToastTypes.danger
					}
				})
			}

			dispatch({ type: AreaActions.remove, payload: initValue.id })
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
								values={{ area: initValue?.title }}></Trans>
						</>
					),
					type: ToastTypes.danger
				}
			})
		} catch (error: any) {
			console.error(error)
			return toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeArea',
					text: String(error.message),
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

	const getImage = (image: string) => {
		if (image === 'office') {
			return <img alt='' src={OfficeImage} />
		} else if (image === 'production') {
			return <img alt='' src={ProductionImage} />
		} else if (image === 'laboratory') {
			return <img alt='' src={LaboratoryImage} />
		} else if (Boolean(trim(image))) {
			return (
				<img
					alt=''
					src={`${process.env.REACT_APP_API_URL}/public/images/area/${initValue?.image}`}
				/>
			)
		}
		return (
			<ImageEmpty hasError={errors.image} onClick={toggleImageInput}>
				<UploadIcon />
				Select or upload an image
			</ImageEmpty>
		)
	}

	const onInputFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e && e.target && !isNil(e.target.files)) {
			const image = e.target.files[0]

			if (Boolean(image.size)) {
				let data = new FormData()
				data.append('image', image)

				try {
					const token = localStorage.getItem('token') as string

					const result = await axios({
						method: 'POST',
						url: `${process.env.REACT_APP_API_URL}/area/upload/image`,
						headers: {
							'Accept': '*/*',
							'Content-Type': 'multipart/form-data',
							'x-access-token': token
						},
						data
					})

					setFileImage(image)
					setImage(result.data.data)
				} catch (error) {
					console.error(error)
				}
			}
		}
	}

	const toggleImageInput = () => {
		inputFileRef?.current?.click()
	}

	return (
		<>
			<Modal
				title={`${isEdit ? t('areas.form.title.update') : t('areas.form.title.create')}`}
				onClose={(visible: boolean) => {
					setIsVisible(visible)
				}}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<ImageWrapper hasError={errors.image}>
							<ImageLabel>Image</ImageLabel>
							{!fileImage ? (
								getImage(image)
							) : (
								<FormImage>
									<FormImageClose
										type='button'
										onClick={() => {
											setFileImage(null)
											setImage('')
										}}>
										<CloseIcon />
									</FormImageClose>
									<img alt='' src={URL.createObjectURL(fileImage)} />
								</FormImage>
							)}
							<ImageOptions>
								<ImageOption
									isSelected={image === 'office' || image === ''}
									onClick={() => {
										setImage('office')
										validateField({ field: 'image', value: 'office' })
									}}>
									<img alt='' src={OfficeImage} />
								</ImageOption>
								<ImageOption
									isSelected={image === 'production' || image === ''}
									onClick={() => {
										setImage('production')

										validateField({ field: 'image', value: 'production' })
									}}>
									<img alt='' src={ProductionImage} />
								</ImageOption>
								<ImageOption
									isSelected={image === 'laboratory' || image === ''}
									onClick={() => {
										setImage('laboratory')

										validateField({ field: 'image', value: 'laboratory' })
									}}>
									<img alt='' src={LaboratoryImage} />
								</ImageOption>
								<input
									type='file'
									ref={inputFileRef}
									onChange={onInputFileChange}
									accept='image/*'
									hidden
								/>
								<Tooltip message='upload image'>
									<ImageOption isSelected onClick={toggleImageInput}>
										<UploadIcon />
									</ImageOption>
								</Tooltip>
							</ImageOptions>
							<ImageError>{errors.image}</ImageError>
						</ImageWrapper>
						<Input
							error={errors.title}
							label={t('areas.form.inputs.title')}
							value={title}
							onBlur={(e) => {
								validateField({ field: 'title', value: trim(e.currentTarget.value) })
							}}
							onChange={(e) => {
								validateField({ field: 'title', value: trim(e.currentTarget.value) })
								setTitle(e.currentTarget.value)
							}}
						/>
						<Select
							error={errors.type}
							label={t('areas.form.inputs.type')}
							value={type}
							onBlur={(e) => {
								validateField({ field: 'type', value: e.currentTarget.value })
							}}
							onChange={(e) => {
								validateField({ field: 'type', value: e.currentTarget.value })
								setType(e.currentTarget.value)
							}}>
							<option value='office'>Office</option>
							<option value='production'>Production</option>
							<option value='laboratory'>Laboratory</option>
						</Select>
						{/* <Select
							error={errors.location}
							label={t('areas.form.inputs.location')}
							value={location}
							onBlur={(e) => {
								validateField({ field: 'location', value: e.currentTarget.value })
							}}
							onChange={(e) => {
								validateField({ field: 'location', value: e.currentTarget.value })
								setLocation(e.currentTarget.value)
							}}>
							{map(locations, (location) => (
								<option value={location.id} key={location.id}>
									{location.name}
								</option>
							))}
						</Select> */}
						<Textarea
							label={t('areas.form.inputs.description')}
							value={description}
							onChange={(e) => setDescription(e.currentTarget.value)}
						/>

						<ActionWrapper>
							{!isEdit && (
								<>
									<Button type='submit' loading={isLoading}>
										<PlusIcon /> {t('areas.form.inputs.create')}
									</Button>
								</>
							)}

							{isEdit && initValue && (
								<>
									<Button
										variant='danger-ghost'
										disabled={isLoading || isDeleteLoading}
										loading={isDeleteLoading}
										onClick={() => {
											setIsVisible(false)
											setIsDeleteConfirmationVisible(true)
										}}>
										<TrashIcon /> {t('areas.form.inputs.delete')}
									</Button>
									<Button
										disabled={isLoading || isDeleteLoading}
										loading={isLoading}
										type='submit'>
										<SaveIcon /> {t('areas.form.inputs.save')}
									</Button>
								</>
							)}
						</ActionWrapper>
					</Wrapper>
				</form>
			</Modal>

			<ConfirmationMessage
				confirmText={initValue?.title}
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
								values={{ value: initValue?.title }}></Trans>
						</p>
					</>
				}
				title={t('confirmation.title', { item: t('areas.item') })}
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

const ImageWrapper = styled.div<{ hasError: string }>`
	display: flex;
	flex-direction: column;
	& > img {
		border-radius: ${(props) => props.theme.radius.medium};
		width: 100%;
		height: auto;
		margin-bottom: 10px;

		${(props) =>
			Boolean(trim(props.hasError)) &&
			css`
				border: 1px solid ${props.theme.colors.danger};
			`}
	}
`

const ImageLabel = styled.span`
	background-color: ${(props) => props.theme.colors.neutral001};
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 700;
	margin-bottom: 10px;
	padding: 0 5px;
`

const ImageOptions = styled.div`
	display: flex;
	width: 100%;
`

const ImageOption = styled.div<{ isSelected?: boolean }>`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral005};
	border-radius: ${(props) => props.theme.radius.medium};
	cursor: pointer;
	display: flex;
	height: 60px;
	justify-content: center;
	margin-right: 10px;
	opacity: ${(props) => (props.isSelected ? 1 : 0.25)};
	overflow: hidden;
	position: relative;
	width: 60px;
	&:hover {
		opacity: 1;
	}
`

const ImageError = styled.div`
	color: ${(props) => props.theme.colors.danger};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	letter-spacing: 0.02em;
	margin-top: 5px;
`

const ImageEmpty = styled.div<{ hasError: string }>`
	align-items: center;
	background: ${(props) => props.theme.colors.neutral005};
	border-radius: ${(props) => props.theme.radius.medium};
	color: ${(props) => props.theme.colors.neutral003};
	cursor: pointer;
	display: flex;
	font-weight: 800;
	height: 180px;
	justify-content: center;
	margin-bottom: 10px;
	width: 100%;

	${(props) =>
		Boolean(trim(props.hasError)) &&
		css`
			border: 1px solid ${props.theme.colors.danger};
		`}

	& > svg {
		margin-right: 10px;
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

const FormImage = styled.div`
	border: 1px solid ${(props) => props.theme.colors.neutral005};
	display: flex;
	margin-bottom: 20px;
	position: relative;
	width: 100%;
	& > img {
		border-radius: ${(props) => props.theme.radius.medium};
		object-fit: contain;
		width: 100%;
	}
`
const FormImageClose = styled.button`
	align-items: center;
	background: ${(props) => props.theme.colors.neutral001};
	border-radius: ${(props) => props.theme.radius.round};
	border: 1px solid ${(props) => props.theme.colors.neutral005};
	box-shadow: ${(props) => props.theme.shadows.default};
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	display: flex;
	height: 30px;
	justify-content: center;
	position: absolute;
	right: -10px;
	top: -10px;
	width: 30px;
`

export default Form
