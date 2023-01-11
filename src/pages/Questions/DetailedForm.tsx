import Button from '@system/Button'
import Input from '@system/Input'
import Select from '@system/Select'
import { createQuestion, removeQuestion, updateQuestion } from 'api/Questions'
import ConfirmationMessage from 'components/ConfirmationMessage'
import Modal from 'components/Modal'
import { ReactComponent as PlusIcon } from 'icons/plus.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { ReactComponent as TrashIcon } from 'icons/trash.svg'
import { map } from 'lodash'
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
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

export type QuestionFormProps = {
	categories: any
	initValue?: any
	isEdit: boolean
	isVisible: boolean
	setIsVisible: Dispatch<SetStateAction<boolean>>
	setLastReset: Dispatch<SetStateAction<Date>>
}

const DetailedForm: FC<QuestionFormProps> = ({
	categories,
	initValue,
	isEdit,
	isVisible,
	setIsVisible,
	setLastReset
}) => {
	const { t } = useTranslation('common')
	const { checklistId } = useParams()

	const [category, setCategory] = useState<string>('')
	const [example, setExample] = useState<string>('')
	const [maxPoints, setMaxPoints] = useState<number>(1)
	const [question, setQuestion] = useState<string>('')
	const [order, setOrder] = useState<number>(0)

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
		useState<boolean>(false)
	const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false)

	const toastDispatch = useToastDispatch()

	/* eslint-disable */
	const clearForm = useCallback(() => {
		setQuestion('')
		setExample('')
		setMaxPoints(1)
		setOrder(0)
		setCategory('')
	}, [])
	/* eslint-enable */

	useEffect(() => {
		clearForm()

		if (isEdit && initValue) {
			setQuestion(initValue?.question)
			setExample(initValue?.example)
			setMaxPoints(Number(initValue?.max_points))
			setCategory(initValue?.category?._id)
			setOrder(Number(initValue?.order))
		}

		return () => {
			clearForm()
		}
	}, [initValue, isEdit, clearForm])

	const onCreate = async () => {
		setIsLoading(true)

		try {
			const result = await createQuestion({
				checklist: checklistId,
				category,
				example,
				maxPoints,
				order,
				question
			})

			if (!result?.data?.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'createQuestion',
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
						id: 'createQuestion',
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
			const { data } = await updateQuestion({
				id: initValue?._id,
				checklist: checklistId,
				category,
				example,
				maxPoints,
				order,
				question
			})

			if (!data?.error && initValue) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'updateQuestion',
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
			await removeQuestion({ id: initValue._id })
			toastDispatch({
				type: ToastActions.add,
				payload: {
					id: 'removeQuestion',
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
					id: 'removeQuestion',
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
				title={`${isEdit ? 'Update Question' : 'Create Question'}`}
				onClose={setIsVisible}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<Input
							label='Question'
							onChange={(e) => {
								setQuestion(e.currentTarget.value)
							}}
							value={question}
						/>
						<Input
							label='Example'
							onChange={(e) => {
								setExample(e.currentTarget.value)
							}}
							value={example}
						/>

						<Select
							label='Category'
							value={category}
							onChange={(e) => setCategory(e.currentTarget.value)}>
							{map(categories, (cat, index) => {
								return (
									<option key={index} value={cat._id}>
										{cat.name} {cat.description && `- ${cat.description}`}
									</option>
								)
							})}
						</Select>

						<Input
							label='Order'
							min={1}
							onChange={(e) => {
								setOrder(Number(e.currentTarget.value))
							}}
							value={order}
							type='number'
						/>

						<Input
							label='Max points'
							onChange={(e) => {
								setMaxPoints(Number(e.currentTarget.value))
							}}
							value={maxPoints}
							type='number'
						/>

						<ActionWrapper>
							{!isEdit && (
								<Button type='submit' loading={isLoading}>
									<PlusIcon /> Add Question
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
										Save Changes
									</Button>
								</>
							)}
						</ActionWrapper>
					</Wrapper>
				</form>
			</Modal>
			<ConfirmationMessage
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

export default DetailedForm
