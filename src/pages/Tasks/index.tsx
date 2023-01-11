import { updateProfile } from 'api/Profile'
import { updateTask } from 'api/Tasks'
import Loader from 'components/Loader'
import MainLayout from 'layout/MainLayout'
import { filter, find, findIndex, flatten, isNil, map, trim } from 'lodash'
import Filter from 'pages/Tasks/Filter'
import { useFetchArea } from 'providers/Areas/useFetchArea'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { useTasksDispatch, useTasksState } from 'providers/Tasks'
import { TaskActions, TaskProps } from 'providers/Tasks/types'
import { useFetchTasks } from 'providers/Tasks/useFetchTasks'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components/macro'
import { getStatusIcon } from 'utils/helpers'
import Details from './Details'
import AreaFilter from './Filter/Area'
import Form from './Form'
import Item from './Item'
const Tasks: FC = () => {
	const { t } = useTranslation('common')
	const { data: tasks, isLoading } = useTasksState()
	const user = useMeState()
	const tasksDispatch = useTasksDispatch()
	const meDispatch = useMeDispatch()

	const columns = useMemo(
		() => [
			{ status: 'todo', text: t('tasks.columns.todo') },
			{ status: 'inprogress', text: t('tasks.columns.inProgress') },
			{ status: 'toreview', text: t('tasks.columns.toReview') },
			{ status: 'done', text: t('tasks.columns.done') }
		],
		[t]
	)

	const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [selectedTask, setSelectedTask] = useState<TaskProps>()
	const [localTaskOrder, setLocalTaskOrder] = useState<Array<string>>(user.taskOrder)
	const [isArchived, setIsArchived] = useState<boolean>(false)

	const [area, setArea] = useState<string>('')
	const [location, setLocation] = useState<string>('')
	const [priority, setPriority] = useState<string>('')
	const [search, setSerch] = useState<string>('')

	useFetchTasks({ archived: isArchived, areaId: area, location, search, priority })
	useFetchArea()

	//initialize profile task order incase no task order found on user's profile
	useEffect(() => {
		if (!user.taskOrder.length) {
			const flattenTaskOrder = flatten(
				map(columns, ({ status }) =>
					map(filterTask({ tasks, status }), (task) => task.id)
				)
			)
			setLocalTaskOrder(flattenTaskOrder)
		} else {
			setLocalTaskOrder(user.taskOrder)
		}
	}, [user.taskOrder, tasks, columns])

	const filterTask = ({ tasks, status }: { tasks: Array<any>; status: string }) => {
		return filter(tasks, (task) => trim(task?.taskStatus.toLocaleLowerCase()) === status)
	}

	const mergeTasks = useCallback(() => {
		const mergedTasks = map(localTaskOrder, (id) => {
			return find(tasks, (task) => task.id === id)
		})

		return mergedTasks.filter((value) => value !== undefined)
	}, [localTaskOrder, tasks])

	const onDragEnd = async (result: DropResult) => {
		const { destination, source, draggableId } = result

		if (!destination) {
			return
		}

		if (area || priority || search) {
			return
		}

		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return
		}

		meDispatch({ type: MeActions.updateLoading, payload: true })
		tasksDispatch({ type: TaskActions.updateLoading, payload: true })

		try {
			const updatedTaskOrder = flatten(
				map(columns, ({ status }) => {
					const orderTasks = map(localTaskOrder, (id) => {
						const foundTasks = find(tasks, (task) => task.id === id)

						return foundTasks
					})

					const mappedTasks = map(
						filterTask({ tasks: orderTasks, status }),
						(task) => task.id
					)

					if (source.droppableId === status) {
						mappedTasks.splice(source.index, 1)
					}

					if (destination.droppableId === status) {
						//drop to destination
						mappedTasks.splice(destination.index, 0, draggableId)
					}

					return mappedTasks
				})
			)

			setLocalTaskOrder(updatedTaskOrder)

			const droppedTaskIndex = findIndex(tasks, (task) => task.id === result.draggableId)
			const droppedTask = tasks[droppedTaskIndex]

			const updatedTasks = tasks.map((task) => {
				if (task.id === droppedTask.id) {
					return {
						...task,
						taskStatus: destination.droppableId
					}
				}
				return task
			})

			meDispatch({
				type: MeActions.update,
				payload: { ...user, taskOrder: updatedTaskOrder }
			})

			tasksDispatch({ type: TaskActions.update, payload: updatedTasks })

			await updateProfile({ ...user, taskOrder: updatedTaskOrder })
			await updateTask({ ...droppedTask, taskStatus: destination.droppableId })

			meDispatch({ type: MeActions.updateLoading, payload: false })
			tasksDispatch({ type: TaskActions.updateLoading, payload: false })
		} catch (error) {
			meDispatch({ type: MeActions.updateLoading, payload: false })
			tasksDispatch({ type: TaskActions.updateLoading, payload: false })
			console.error(error)
		}
	}

	const onTaskClick = (task: TaskProps) => {
		setSelectedTask(task)
		setIsDetailsVisible(true)
	}

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Tasks</title>
			</Helmet>

			<Details
				title={selectedTask?.title ? selectedTask?.title : ''}
				selectedTask={selectedTask}
				isVisible={isDetailsVisible}
				onClose={setIsDetailsVisible}
				onShowForm={() => {
					setIsFormVisible(true)
					setIsDetailsVisible(false)
				}}
			/>
			{!isNil(selectedTask) && (
				<Form
					initValue={selectedTask}
					isVisible={isFormVisible}
					setIsVisible={setIsFormVisible}
					onCloseForm={() => setIsDetailsVisible(true)}
				/>
			)}

			<Wrapper>
				<Filter
					archived={isArchived}
					area={area}
					location={location}
					priority={priority}
					search={search}
					setArea={setArea}
					setArchived={setIsArchived}
					setLocation={setLocation}
					setPriority={setPriority}
					setSearch={setSerch}
				/>
				<AreaFilterTaskWrapper>
					<AreaFilter value={area} setValue={setArea} />
					<TaskWrapper>
						{!isArchived ? (
							<DragDropContext onDragEnd={onDragEnd}>
								{isLoading || (user.isLoading && <Loader isModal />)}
								{!isLoading && !user.isLoading && (
									<>
										{map(columns, ({ status, text }, index) => (
											<Column key={index}>
												<Title>
													<TitleText>{text}</TitleText>
													{getStatusIcon(status)}
												</Title>
												<Droppable droppableId={status}>
													{(provided) => (
														<ScrollWrapper
															{...provided.droppableProps}
															ref={provided.innerRef}>
															{map(
																filterTask({
																	tasks: mergeTasks(),
																	status
																}),
																(value, i) => {
																	return (
																		<Item
																			onClick={onTaskClick}
																			key={value.id}
																			index={i}
																			draggable={!area && !priority && !search}
																			{...value}
																		/>
																	)
																}
															)}
															{provided.placeholder}
														</ScrollWrapper>
													)}
												</Droppable>
											</Column>
										))}
									</>
								)}
							</DragDropContext>
						) : (
							<Column width='400px'>
								<Title>Archived tasks</Title>
								{map(tasks, (task, index) => {
									return (
										<Item
											draggable={false}
											onClick={onTaskClick}
											key={task.id}
											index={index}
											{...task}
										/>
									)
								})}
							</Column>
						)}
					</TaskWrapper>
				</AreaFilterTaskWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: calc(100% - 160px);
	width: 100%;
`

const AreaFilterTaskWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	@media screen and (min-width: 992px) {
		margin-left: 300px;
	}
`

const TaskWrapper = styled.div`
	display: flex;
	flex: 1;
	max-width: 100%;
	overflow: auto;
`

const ScrollWrapper = styled.ul`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	width: 100%;
	padding: 0;
	margin: 0;
	overflow: hidden;
`

const Column = styled.div<{ width?: string }>`
	display: flex;
	flex-direction: column;
	min-width: 60%;
	overflow: auto;
	padding: 0 10px 20px 10px;
	position: relative;
	${(props) =>
		props.width
			? css`
					width: ${props.width};
			  `
			: css`
					flex: 1;
			  `}
	& ul {
		overflow: visible;
	}
	@media screen and (min-width: 425px) {
		min-width: 60%;
	}
	@media screen and (min-width: 768px) {
		min-width: auto;
	}
`

const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral000};
	font-weight: 800;
	font-size: ${(props) => props.theme.font.sizes.medium};
	text-transform: capitalize;
	padding: 20px;
	position: sticky;
	top: 0%;
	z-index: 10;
	background: ${(props) => props.theme.colors.neutral001};
	border: 1px solid ${(props) => props.theme.colors.neutral005};
	margin-bottom: 10px;
	border-radius: 10px;
	display: flex;
	align-items: center;
`

const TitleText = styled.span`
	margin-right: auto;
`

export default Tasks
