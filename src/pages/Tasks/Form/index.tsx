import Button from '@system/Button'
import DateTimePicker from '@system/DateTimePicker'
import Input from '@system/Input'
import Select from '@system/Select'
import Textarea from '@system/Textarea'
import { updateTask } from 'api/Tasks'
import Modal from 'components/Modal'
import { ReactComponent as ArchiveIcon } from 'icons/archive.svg'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { trim } from 'lodash'
import { useTasksDispatch, useTasksState } from 'providers/Tasks'
import { TaskActions, TaskProps } from 'providers/Tasks/types'
import { Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import useTaskValidation from './Validation'

export type TaskFormFormProps = {
	initValue: TaskProps
	isVisible: boolean
	onCloseForm: () => void
	setIsVisible: Dispatch<SetStateAction<boolean>>
}

const Form: FC<TaskFormFormProps> = ({
	initValue,
	isVisible,
	onCloseForm,
	setIsVisible
}) => {
	const { t } = useTranslation('common')
	const tasksDispatch = useTasksDispatch()
	const tasks = useTasksState()

	const [area, setArea] = useState<string>('')
	const [description, setDescription] = useState<string>('')
	const [dueDate, setDueDate] = useState<Date>(new Date())
	const [priority, setPriority] = useState<string>('')
	const [status, setStatus] = useState<string>('')
	const [title, setTitle] = useState<string>('')

	const [isArchiveLoading, setIsArchiveLoading] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const initialErrors = {
		title: ''
	}

	const { errors, validateField } = useTaskValidation({
		initialErrors
	})

	useEffect(() => {
		setArea(`${initValue.area.title}`)
		setDescription(initValue.description)
		setDueDate(new Date(initValue.dueDate))
		setPriority(initValue.priority.toLowerCase())
		setStatus(initValue.taskStatus.toLowerCase())
		setTitle(initValue.title)
	}, [initValue])

	const onEdit = async () => {
		setIsLoading(true)
		try {
			const res = await updateTask({
				archived: initValue.archived,
				audit: initValue.audit,
				description,
				dueDate,
				id: initValue.id,
				priority,
				status: initValue.status,
				taskStatus: status,
				title
			})

			if (!res.data.error) {
				tasksDispatch({
					type: TaskActions.update,
					payload: tasks.data.map((task) => {
						if (task.id === initValue.id) {
							return {
								...task,
								description,
								dueDate,
								priority,
								status: initValue.status,
								taskStatus: status,
								title
							}
						}

						return task
					})
				})
			}

			setIsLoading(false)
			setIsVisible(false)
		} catch (error) {
			setIsLoading(false)
			console.error(error)
		}
	}

	const onSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (isLoading) {
			return
		}

		const isTitleValid = validateField({ field: 'title', value: title })

		if (isTitleValid) {
			onEdit()
		}
	}

	const onTaskArchived = async () => {
		setIsArchiveLoading(true)

		if (!initValue) {
			setIsArchiveLoading(false)
			return
		}

		try {
			await updateTask({ ...initValue, archived: !initValue.archived })

			setIsArchiveLoading(false)
			setIsVisible(false)

			tasksDispatch({
				type: TaskActions.update,
				payload: !initValue?.archived
					? tasks.data.filter((task) => task.id !== initValue.id)
					: tasks.data.map((task) => {
							if (task.id === initValue.id) {
								return {
									...task,
									archived: !initValue.archived
								}
							}

							return task
					  })
			})
		} catch (error: any) {
			console.error(error)

			setIsArchiveLoading(false)
			setIsVisible(false)
		}
	}

	return (
		<>
			<Modal
				title={t('tasks.form.title')}
				onClose={(isClose: boolean) => {
					onCloseForm()
					setIsVisible(isClose)
				}}
				isVisible={isVisible}>
				<form onSubmit={onSubmit}>
					<Wrapper>
						<Input
							label={t('tasks.form.inputs.area')}
							value={area}
							onChange={() => {}}
							readOnly
						/>

						<Input
							error={errors.title}
							label={t('tasks.form.inputs.title')}
							onChange={(e) => {
								validateField({ field: 'title', value: trim(e.currentTarget.value) })
								setTitle(e.currentTarget.value)
							}}
							onBlur={(e) => {
								validateField({ field: 'title', value: trim(e.currentTarget.value) })
							}}
							value={title}
						/>
						<DateTimePicker
							label={t('tasks.form.inputs.dueDate')}
							onChange={(date) => setDueDate(date)}
							value={dueDate}
						/>
						<Select
							label={t('tasks.form.inputs.priority')}
							onChange={(e) => {
								setPriority(e.currentTarget.value)
							}}
							value={priority}>
							<option value='low'>Low</option>
							<option value='medium'>Medium</option>
							<option value='high'>High</option>
							<option value='urgent'>Urgent</option>
						</Select>
						<Select
							label={t('tasks.form.inputs.status')}
							onChange={(e) => {
								setStatus(e.currentTarget.value)
							}}
							value={status}>
							<option value='todo'>Todo</option>
							<option value='inprogress'>In progress</option>
							<option value='toreview'>To review</option>
							<option value='done'>Done</option>
						</Select>
						<Textarea
							label={t('tasks.form.inputs.description')}
							onChange={(e) => setDescription(e.currentTarget.value)}
							value={description}
						/>
						<ActionWrapper>
							{initValue && (
								<>
									{initValue?.taskStatus === 'done' && (
										<Button
											disabled={isLoading || isArchiveLoading}
											loading={isArchiveLoading}
											variant='ghost'
											onClick={onTaskArchived}>
											<ArchiveIcon />{' '}
											{initValue.archived
												? t('tasks.form.inputs.unarchive')
												: t('tasks.form.inputs.archive')}
										</Button>
									)}
									<Button
										disabled={isLoading || isArchiveLoading}
										loading={isLoading}
										type='submit'>
										<SaveIcon /> {t('tasks.form.inputs.save')}
									</Button>
								</>
							)}
						</ActionWrapper>
					</Wrapper>
				</form>
			</Modal>
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
		padding: 10px 20px;

		&:last-child {
			margin-left: 10px;
		}
		&:first-child {
			margin-left: auto;
		}
	}
`

export default Form
