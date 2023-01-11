import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { EmptyStateText, EmptyStateWrapper } from 'components/List'
import Placeholder from 'components/Placeholder'
import StackChart from 'components/StackChart'
import FiveSAudit from 'icons/5sAudit.png'
import SixSAudit from 'icons/6sAudit.png'
import { ReactComponent as ArrowBackIcon } from 'icons/arrowBackward.svg'
import { ReactComponent as DownloadIcon } from 'icons/download.svg'
import LogoIcon from 'icons/logoIcon.png'
import jsPDF from 'jspdf'
import { find, map, size, sum } from 'lodash'
import { DateTime } from 'luxon'
import { useAreasState } from 'providers/Areas'
import { AreaProps } from 'providers/Areas/types'
import { useFetchArea } from 'providers/Areas/useFetchArea'
import { useAuditsState } from 'providers/Audits'
import { AuditProps } from 'providers/Audits/types'
import { useFetchFilteredAudits } from 'providers/Audits/useFetchFilteredAudits'
import { useMeState } from 'providers/Me'
import { useTasksState } from 'providers/Tasks'
import { useFetchTasks } from 'providers/Tasks/useFetchTasks'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCurrentPng } from 'recharts-to-png'
import styled, { css } from 'styled-components/macro'
import { getReport } from 'utils/helpers'

const Report: FC = () => {
	const { t } = useTranslation('common')
	const { areaId, userId, standard } = useParams()
	const navigate = useNavigate()

	const [searchParams] = useSearchParams()
	const [getChartPng, { ref: barRef }] = useCurrentPng()

	const [currentArea, setCurrentArea] = useState<AreaProps>()
	const [isPrinting, setIsPrinting] = useState<boolean>(false)

	const { targetScore } = useMeState()
	const { data, isLoading } = useAuditsState()
	const { data: areaData } = useAreasState()
	const { data: tasks } = useTasksState()

	const reports = useMemo(() => getReport(data), [data])
	const scores = useMemo(() => map(data, ({ scores }) => scores).flat(), [data])
	/* eslint-disable */
	const latestScores = useMemo(() => {
		if (standard === '6s') {
			return [
				{
					id: 's1',
					score: Math.round((reports[0]?.s1 / 15) * 100),
					name: t('6s.s1'),
					color: '#F7B94D'
				},
				{
					id: 's2',
					score: Math.round((reports[0]?.s2 / 15) * 100),
					name: t('6s.s2'),
					color: '#90EB5B'
				},
				{
					id: 's3',
					score: Math.round((reports[0]?.s3 / 15) * 100),
					name: t('6s.s3'),
					color: '#6CD6E5'
				},
				{
					id: 's4',
					score: Math.round((reports[0]?.s4 / 15) * 100),
					name: t('6s.s4'),
					color: '#8892E7'
				},
				{
					id: 's5',
					score: Math.round((reports[0]?.s5 / 25) * 100),
					name: t('6s.s5'),
					color: '#D39EDB'
				},
				{
					id: 's6',
					score: Math.round((reports[0]?.s6 / 15) * 100),
					name: t('6s.s6'),
					color: '#E67A81'
				},
				{
					id: 'oa',
					score: sum([
						reports[0]?.s1,
						reports[0]?.s2,
						reports[0]?.s3,
						reports[0]?.s4,
						reports[0]?.s5,
						reports[0]?.s6
					]),
					name: 'Overall',
					color: '#7b7b7b'
				}
			]
		} else {
			return [
				{
					id: 's1',
					score: Math.round((reports[0]?.s1 / 15) * 100),
					name: t('6s.s1'),
					color: '#F7B94D'
				},
				{
					id: 's2',
					score: Math.round((reports[0]?.s2 / 15) * 100),
					name: t('6s.s2'),
					color: '#90EB5B'
				},
				{
					id: 's3',
					score: Math.round((reports[0]?.s3 / 15) * 100),
					name: t('6s.s3'),
					color: '#6CD6E5'
				},
				{
					id: 's4',
					score: Math.round((reports[0]?.s4 / 15) * 100),
					name: t('6s.s4'),
					color: '#8892E7'
				},
				{
					id: 's5',
					score: Math.round((reports[0]?.s5 / 40) * 100),
					name: t('6s.s5'),
					color: '#D39EDB'
				},
				{
					id: 'oa',
					score: sum([
						reports[0]?.s1,
						reports[0]?.s2,
						reports[0]?.s3,
						reports[0]?.s4,
						reports[0]?.s5,
						reports[0]?.s6
					]),
					name: 'Overall',
					color: '#7b7b7b'
				}
			]
		}
	}, [reports, data])
	/* eslint-disable */

	const PDF_SCALE = 0.35

	const lastAudit = useMemo(() => {
		const auditDates = map(data, (audits: AuditProps) => audits.createdAt.toMillis())

		return DateTime.fromMillis(Math.max(...auditDates)).toFormat('MMMM dd yyyy')
	}, [data])

	const auditor = useMemo(() => {
		const name = `${data[0]?.createdBy?.firstname} ${data[0]?.createdBy?.lastname}`
		return name.trim() ? name : data[0]?.createdBy?.email
	}, [data])
	/* eslint-disable */
	const savePDF = useCallback(
		async ({ filename }: { filename: string }) => {
			setIsPrinting(true)

			const doc = new jsPDF('portrait', 'px', 'a4')
			const tasks = document.getElementById('tasks')
			const score = document.getElementById('score')

			const svg = document.getElementById('barchart') as HTMLElement
			const chartDimension = svg.getBoundingClientRect()
			const chartPng: any = await getChartPng()

			await doc.html(tasks as HTMLElement, {
				html2canvas: {
					scale: PDF_SCALE
				},
				x: 15,
				y: 285,
				autoPaging: 'text'
			})

			await doc.html(score as HTMLElement, {
				html2canvas: {
					scale: PDF_SCALE
				},
				x: 15,
				y: 0,
				autoPaging: 'text'
			})

			doc.addImage(
				chartPng,
				'PNG',
				16,
				50,
				chartDimension.width * PDF_SCALE - 0.5,
				chartDimension.height * PDF_SCALE - 0.5,
				'chart'
			)

			doc.save(`${filename} report.pdf`)
			setIsPrinting(false)
		},
		[scores]
	)
	/* eslint-disable */

	useEffect(() => {
		setCurrentArea(find(areaData, (area) => areaId === area.id))
	}, [areaId, areaData])

	/* eslint-disable */
	useEffect(() => {
		setTimeout(() => {
			if (searchParams.get('auto')) {
				savePDF({ filename: `${currentArea?.title}` })
			}
		}, 5000)
	}, [currentArea?.title, searchParams])
	/* eslint-disable */

	useFetchFilteredAudits({
		areaId,
		userId,
		standard,
		isShort: 'full'
	})
	useFetchArea({ userId })
	useFetchTasks({ areaId, userId })

	if (isLoading) {
		return <Placeholder>{t('reports.loading')}...</Placeholder>
	}

	if (!isLoading && !Boolean(size(data))) {
		return (
			<EmptyStateWrapper>
				<EmptyStateText>
					<H as='h4'>{t('reports.emptyState.title')}</H>
					<Text>{t('reports.emptyState.text')}</Text>
				</EmptyStateText>
			</EmptyStateWrapper>
		)
	}

	return (
		<MainWrapper>
			{searchParams.get('auto') && (
				<DownloadNotice>
					{t('reports.download')},
					<Highlight onClick={() => savePDF({ filename: `${currentArea?.title}` })}>
						{t('reports.startDownload')}
					</Highlight>
				</DownloadNotice>
			)}
			<Controls>
				<Back onClick={() => navigate(`/reports/${areaId}`)}>
					<ArrowBackIcon /> <span>Report</span>
				</Back>
				<Actions>
					<Button onClick={() => savePDF({ filename: `${currentArea?.title}` })}>
						<DownloadIcon /> {t('reports.downloadReports')}
					</Button>
				</Actions>
			</Controls>
			<Wrapper>
				<CategoryAvgScore id='score'>
					<Header>
						<ReportInfo>
							<SixSIcon src={standard === '6s' ? SixSAudit : FiveSAudit} alt='' />

							<Info>
								<Title>{currentArea?.title}</Title>
								<Meta>{t('reports.info.area')}</Meta>
							</Info>

							<Info>
								<Title>{lastAudit}</Title>
								<Meta>{t('reports.info.lastAudit')}</Meta>
							</Info>

							<Info>
								<Title>{auditor}</Title>
								<Meta>{t('reports.info.auditor')}</Meta>
							</Info>
							<CompanyLogo src={LogoIcon} alt='' />
						</ReportInfo>
					</Header>

					<ChartScore>
						<ChartWrapper>
							<StackChart
								hasSafety={standard === '6s'}
								allMonth
								data={reports}
								target={targetScore}
								ref={barRef}
								isPrinting={isPrinting}
								customTheme='light'
								disabledTooltip
							/>
						</ChartWrapper>
						<ScoreBreakdown>
							{map(latestScores, (score, index) => {
								return (
									<LatestScoreInfo key={score.id}>
										<Score>
											{score.score}
											<span>%</span>
										</Score>
										<ScoreTitle color={score.color}>{score.name}</ScoreTitle>
									</LatestScoreInfo>
								)
							})}
						</ScoreBreakdown>
					</ChartScore>
				</CategoryAvgScore>
				<ShareTable id='tasks'>
					<TableHead>
						<Data isStrong>{t('reports.tasks.title')}</Data>
						<Data isStrong>{t('reports.tasks.due')}</Data>
						<Data isStrong>{t('reports.tasks.reponsible')}</Data>
						<Data isStrong width={180}>
							{t('reports.tasks.progress')} (%)
						</Data>
					</TableHead>
					<TableBody>
						{map(tasks, ({ dueDate, title }, index) => (
							<Row key={index}>
								<Data>{title}</Data>
								<Data>{DateTime.fromJSDate(dueDate).toFormat('yyyy MMMM dd')}</Data>
								<Data></Data>
								<Data width={180}>
									<Progress>
										<Box>25</Box>
										<Box>50</Box>
										<Box>75</Box>
										<Box>100</Box>
									</Progress>
								</Data>
							</Row>
						))}
					</TableBody>
				</ShareTable>
			</Wrapper>
		</MainWrapper>
	)
}

const DownloadNotice = styled.div`
	text-align: center;
	margin: 0 auto;
	padding: 40px;
`

const Highlight = styled.span`
	text-decoration: underline;
	color: ${(props) => props.theme.colors.primary};
	cursor: pointer;
	&:hover {
		opacity: 0.75;
	}
`

const MainWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: 15px;
`

const Controls = styled.div`
	background: ${(props) => props.theme.colors.neutral001};
	border-radius: 5px 5px 0 0;
	display: flex;
	padding: 30px;
	width: 1240px;
	margin: 30px auto 0;
`

const Wrapper = styled.div`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-radius: 0 0 5px 5px;
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding: 0 30px 30px 30px;
	width: 1240px;
	margin: 1px auto 30px auto;
`

const Back = styled.button`
	display: flex;
	align-items: center;
	background-color: none;
	border: none;
	color: ${(props) => props.theme.colors.primary};
	margin-right: auto;
	padding: 0 10px 0 0;
	cursor: pointer;
	&:hover {
		opacity: 0.75;
	}

	& span {
		font-size: ${(props) => props.theme.font.sizes.medium};
		font-weight: 600;
		margin-left: 5px;
	}
`

const Header = styled.div`
	align-items: center;
	border-radius: 5px;
	display: flex;
	padding: 30px 0;
	width: 100%;
`

const Actions = styled.div`
	display: flex;
`

const ReportInfo = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
`

const CompanyLogo = styled.img`
	width: 30px;
	margin-left: auto;
`

const SixSIcon = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 30px;
`

const Info = styled.div`
	display: flex;
	flex-direction: column;
	margin-right: 60px;
	margin-top: 7px;
`

const Meta = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-weight: 600;
`

const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	text-transform: capitalize;
	margin-bottom: 0;
	line-height: ${(props) => props.theme.font.sizes.h5};
	flex: 1;
`

const ChartScore = styled.div`
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	border-radius: 5px;
	overflow: hidden;
`

const ChartWrapper = styled.div`
	width: 100%;
	margin-top: 40px;
	height: 560px;
`

const CategoryAvgScore = styled.div`
	width: 100%;
`

const ShareTable = styled.div`
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	border-radius: 5px;
	margin-top: 20px;
	overflow: hidden;
	width: 100%;
`
const TableHead = styled.div`
	display: flex;
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	padding: 10px 0;
`

const TableBody = styled.div`
	width: 100%;
`

const Row = styled.div`
	display: flex;
	width: 100%;
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	&:last-child {
		border-bottom: none;
	}
`

const Data = styled.div<{
	align?: string
	color?: string
	isDanger?: boolean
	isStrong?: boolean
	isUppercase?: boolean
	width?: number
}>`
	color: ${(props) =>
		props.isDanger
			? props.theme.colors.danger
			: props.color
			? props.theme.colors[props.color]
			: props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: ${(props) => (props.isStrong ? 700 : 400)};
	text-transform: ${(props) => (props.isUppercase ? 'uppercase' : 'unset')};
	padding: 7px 15px;
	text-align: ${(props) => props.align};
	${(props) =>
		props.width
			? css`
					width: ${props.width}px;
			  `
			: css`
					flex: 1;
			  `}
`

const Progress = styled.div`
	display: flex;
`

const Box = styled.div`
	align-items: center;
	border: 1px solid ${(props) => props.theme.colors.neutral000};
	height: 100%;
	height: 30px;
	justify-content: center;
	margin-right: 10px;
	width: 30px;
	display: flex;
	font-size: ${(props) => props.theme.font.sizes.tiny};
	&:last-child {
		margin-right: 0;
	}
`

const ScoreBreakdown = styled.div`
	display: flex;
	width: 100%;
	height: auto;
	padding: 10px 0;
	margin-bottom: 20px;
`

const LatestScoreInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
`

const Score = styled.h4`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.h3};
`

const ScoreTitle = styled.span<{ color: string }>`
	color: ${(props) => props.color};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 700;
`

export default Report
