import H from '@system/H'
import Text from '@system/Text'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import Placeholder from 'components/Placeholder'
import StackChart from 'components/StackChart'
import { size } from 'lodash'
import { DateTime } from 'luxon'
import { useAuditsState } from 'providers/Audits'
import { useFetchAudit } from 'providers/Audits/useFetchAudit'
import { useFetchFilteredAudits } from 'providers/Audits/useFetchFilteredAudits'
import { useMeState } from 'providers/Me'
import { useTasksState } from 'providers/Tasks'
import { useFetchTasks } from 'providers/Tasks/useFetchTasks'
import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import styled, { useTheme } from 'styled-components/macro'
import { getElapseTime, getReport, getStatusIcon } from 'utils/helpers'

const Report: FC = () => {
	const { t } = useTranslation('common')
	const { id } = useParams()
	const theme = useTheme()
	const { targetScore, is6s, id: userId } = useMeState()

	const { data, isLoading, details } = useAuditsState()
	const { data: tasks, isLoading: isTasksLoading } = useTasksState()

	const [currentAudit, setCurrentAudit] = useState<string>()

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

	useFetchFilteredAudits({
		areaId: `${id}`,
		standard: is6s ? '6s' : '5s',
		userId,
		isShort: 'full'
	})
	useFetchAudit({ id: `${currentAudit}` })
	useFetchTasks({ areaId: id, userId })

	const reports = useMemo(() => getReport(data), [data])

	if (isLoading) {
		return <Placeholder>{t('reports.loading')}...</Placeholder>
	}

	return (
		<>
			<Wrapper>
				<StackChart hasSafety={is6s} allMonth data={reports} target={targetScore} />
			</Wrapper>
			{!isTasksLoading && Boolean(size(tasks)) && (
				<TasksWrapper>
					<TasksTitle>{t('tasks.item')}</TasksTitle>
					<List
						hasPadding={false}
						hasMargin={false}
						data={tasks}
						emptyStatetext={
							<>
								<H as='h4'>{t('tasks.emptyState.title')}</H>
								<Text>{t('tasks.emptyState.title')}</Text>
							</>
						}
						ghostLoading={{
							dataCount: 3,
							itemCount: 4
						}}
						isLoading={isTasksLoading}
						itemFormat={(value) => (
							<>
								<Data value={value.title} text={value.area.title} isBlocked={true} />
								<Data
									desktopOnly
									value={getElapseTime(DateTime.fromJSDate(value.dueDate))}
								/>
								<Data
									value={
										<DataStatus>
											{getStatusIcon(value.taskStatus)} {getTaskStatus(value.taskStatus)}
										</DataStatus>
									}
									title={getTaskStatus(value.taskStatus)}
								/>
							</>
						)}
					/>
				</TasksWrapper>
			)}
		</>
	)
}

const Wrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	height: calc(100vh - 240px);
	justify-content: center;
	flex: 1 0 auto;
	@media screen and (min-width: 992px) {
		padding: 20px;
	}
`

const TasksWrapper = styled.div`
	padding: 0 30px;
`

const Audits = styled.div`
	display: flex;
	flex-direction: column;
`

const AuditsDate = styled.span`
	font-weight: 600;
	font-size: 14px;
	padding: 15px 0;
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral004};
	cursor: pointer;
	&:hover {
		opacity: 0.75;
	}
	&:active {
		opacity: 0.5;
	}
`

const AuditsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-top: 20px;
`

const NoDeviation = styled.div`
	padding: 15px;
	color: ${(props) => props.theme.colors.neutral003};
`

const TasksTitle = styled.div`
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	flex: 1;
	padding-bottom: 30px;
`

const DataStatus = styled.div`
	display: flex;
	align-items: center;
	grid-gap: 10px;
`

export default Report
