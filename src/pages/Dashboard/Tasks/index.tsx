import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import Card from 'components/Card'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import { ReactComponent as ArrowTopRightIcon } from 'icons/arrowTopRight.svg'
import { filter, map } from 'lodash'
import { DateTime } from 'luxon'
import { useMeState } from 'providers/Me'
import { useTasksState } from 'providers/Tasks'
import { useFetchTasks } from 'providers/Tasks/useFetchTasks'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { useTheme } from 'styled-components/macro'
import { getElapseTime, getStatusIcon } from 'utils/helpers'

const Tasks: FC = () => {
	const { t } = useTranslation('common')
	const { data, isLoading } = useTasksState()
	const { id: userId } = useMeState()
	const theme = useTheme()

	useFetchTasks({ userId })

	const tasksData = useMemo(() => {
		const openTasks = filter(
			map(data, ({ taskStatus }) => {
				return taskStatus
			}),
			(value) => value !== 'done'
		)

		const inProgressTasks = filter(
			map(data, ({ taskStatus }) => {
				return taskStatus
			}),
			(value) => value === 'inprogress'
		)

		const doneTasks = filter(
			map(data, ({ taskStatus }) => {
				return taskStatus
			}),
			(value) => value === 'done'
		)

		return {
			open: openTasks.length,
			inProgress: inProgressTasks.length,
			done: doneTasks.length
		}
	}, [data])

	const getTaskStatus = (status: string) => {
		switch (status) {
			case 'todo':
				return t('tasks.columns.todo')
			case 'inprogress':
				return t('tasks.columns.inProgress')
			case 'toreview':
				return t('tasks.columns.toReview')
			case 'done':
				return t('tasks.columns.done')
		}
	}

	return (
		<Wrapper>
			<CardWrapper>
				<Header>
					<TitleContainer>
						<Title>{t('dashboard.tasks.title')}</Title>
					</TitleContainer>
					<Button to='/tasks' size='small'>
						<ArrowTopRightIcon /> {t('dashboard.tasks.viewTasks')}
					</Button>
				</Header>
				<Info>
					<TaskData>
						<Value color={theme.colors.s4}>{tasksData.open}</Value>
						<Metadata>Open tasks</Metadata>
					</TaskData>

					<TaskData>
						<Value color={theme.colors.s1}>{tasksData.inProgress}</Value>
						<Metadata>In progress</Metadata>
					</TaskData>

					<TaskData>
						<Value color={theme.colors.s2}>{tasksData.done}</Value>
						<Metadata>Close tasks</Metadata>
					</TaskData>
				</Info>
				<List
					hasPadding={false}
					hasMargin={false}
					data={data.slice(0, 4)}
					emptyStatetext={<H as='h4'>{t('tasks.emptyState.title')}</H>}
					ghostLoading={{
						dataCount: 2,
						itemCount: 4
					}}
					isLoading={isLoading}
					itemFormat={(value) => (
						<>
							<Data value={value.title} text={value.area.title} isBlocked={true} />
							<Data
								desktopOnly
								value={getElapseTime(DateTime.fromJSDate(value.dueDate))}
							/>
							<Data
								width={30}
								value={getStatusIcon(value.taskStatus)}
								title={getTaskStatus(value.taskStatus)}
							/>
						</>
					)}
				/>
			</CardWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	grid-column: span 6;
	@media screen and (min-width: 992px) {
		grid-column: 3/7;
		grid-row: 2/3;
	}
`

const CardWrapper = styled(Card)`
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-bottom: 0;
	padding: 30px;
`

const Header = styled.div`
	align-items: baseline;
	display: flex;
	margin-bottom: 30px;
	width: 100%;
`

const TitleContainer = styled.div`
	display: flex;
	margin-right: auto;
	align-items: baseline;
`

const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	margin-right: 20px;
`

const TaskData = styled.div`
	diplay: flex;
	flex-direction: column;
	padding: 15px;
	border-radius: 20px;
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	width: 140px;
	height: 140px;
`

const Value = styled.div<{ color: string }>`
	font-size: 60px;
	font-weight: 700;
	line-height: 72px;
	color: ${(props) => props.color};
`

const Metadata = styled.div`
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.04em;
`

const Info = styled.div`
	display: flex;
	padding-right: 40px;
	width: 100%;
	grid-gap: 20px;
	margin-bottom: 20px;
`

export default Tasks
