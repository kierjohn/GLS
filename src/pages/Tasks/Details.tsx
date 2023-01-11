import Button from '@system/Button'
import { updateTask } from 'api/Tasks'
import Modal, { ModalProps } from 'components/Modal'
import { ReactComponent as ArchiveIcon } from 'icons/archive.svg'
import { ReactComponent as EditIcon } from 'icons/edit.svg'
import { isNil } from 'lodash'
import { DateTime } from 'luxon'
import { darken } from 'polished'
import { useTasksDispatch, useTasksState } from 'providers/Tasks'
import { TaskActions, TaskProps } from 'providers/Tasks/types'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { getElapseTime } from 'utils/helpers'

export type TaskDetailsProps = {
	selectedTask?: TaskProps
	onShowForm?: () => void
}

const Details: FC<ModalProps & TaskDetailsProps> = ({
	isVisible,
	selectedTask,
	title,
	onClose,
	onShowForm
}) => {
	const { t } = useTranslation('common')

	const tasksDispatch = useTasksDispatch()
	const tasks = useTasksState()

	const dueText = getElapseTime(DateTime.fromJSDate(new Date(`${selectedTask?.dueDate}`)))
	const [isArchiveLoading, setIsArchiveLoading] = useState<boolean>(false)
	const [isImageNotFound, setIsImageNotFound] = useState<boolean>(false)

	const onTaskArchived = async () => {
		setIsArchiveLoading(true)

		if (!selectedTask) {
			setIsArchiveLoading(false)
			return
		}

		try {
			await updateTask({ ...selectedTask, archived: !selectedTask.archived })

			setIsArchiveLoading(false)
			!isNil(onClose) && onClose(false)

			tasksDispatch({
				type: TaskActions.update,
				payload: !selectedTask?.archived
					? tasks.data.filter((task) => task.id !== selectedTask.id)
					: tasks.data.map((task) => {
							if (task.id === selectedTask.id) {
								return {
									...task,
									archived: !selectedTask.archived
								}
							}

							return task
					  })
			})
		} catch (error: any) {
			console.error(error)

			setIsArchiveLoading(false)
			!isNil(onClose) && onClose(false)
		}
	}

	return (
		<Modal isVisible={isVisible} subtitle={dueText} title={' '} onClose={onClose}>
			{selectedTask?.image && !isImageNotFound && (
				<TaskImage
					onError={(result: any) => {
						setIsImageNotFound(true)
					}}
					src={`${process.env.REACT_APP_API_URL}/public/images/audit/${selectedTask?.image}`}
					alt='task image'
				/>
			)}
			<Area>{selectedTask?.area?.title}</Area>
			<Title>{selectedTask?.title}</Title>

			<Description>{selectedTask?.description}</Description>
			<Due>
				{selectedTask && (
					<Priority level={selectedTask.priority}>
						<PriorityText> {selectedTask.priority}</PriorityText>
					</Priority>
				)}
			</Due>
			<Actions>
				{selectedTask?.taskStatus === 'done' && (
					<Button loading={isArchiveLoading} variant='ghost' onClick={onTaskArchived}>
						<ArchiveIcon />{' '}
						{selectedTask.archived
							? t('tasks.form.inputs.unarchive')
							: t('tasks.form.inputs.archive')}
					</Button>
				)}
				<Button onClick={onShowForm}>
					<EditIcon /> {t('tasks.form.inputs.edit')}
				</Button>
			</Actions>
		</Modal>
	)
}

const TaskImage = styled.img`
	border-radius: ${(props) => props.theme.radius.medium};
	margin-bottom: 20px;
	width: 100%;
`

const Area = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 800;
	line-height: 1.2em;
	letter-spacing: 0.125em;
	text-transform: uppercase;
`

const Title = styled.div`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.large};
	font-weight: 800;
	line-height: 1.2em;
	margin-bottom: 20px;
`

const Description = styled.div`
	color: ${(props) => props.theme.colors.neutral002};
	font-size: ${(props) => props.theme.font.sizes.medium};
	letter-spacing: 0.02em;
	line-height: 1.5em;
	margin-bottom: 20px;
`

const Due = styled.div`
	align-items: center;
	display: flex;
	margin-bottom: 40px;
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	& > * {
		margin-right: 10px;
	}
`

const Priority = styled.div<{ level: string }>`
	align-items: center;
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	height: 24px;
	padding: 3px 10px;
	${(props) => {
		switch (props.level.toLowerCase()) {
			case 'medium':
				return css`
					background: ${props.theme.colors.warning};
				`
			case 'high':
				return css`
					background: ${props.theme.colors.danger};
				`
			case 'urgent':
				return css`
					background: ${darken(0.35, props.theme.colors.danger)};
				`
			default:
				return css`
					background: ${props.theme.colors.success};
				`
		}
	}};
	border-radius: ${(props) => props.theme.radius.small};
`

const PriorityText = styled.span`
	background: none;
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 900;
	text-transform: uppercase;
	letter-spacing: 0.125em;
`

export default Details
