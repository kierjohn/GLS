import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import { EmptyStateText, EmptyStateWrapper } from 'components/List'
import { isNil } from 'lodash'
import { useMeState } from 'providers/Me'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	Rectangle,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import { ContentType } from 'recharts/types/component/DefaultLegendContent'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { ContentType as TooltipContentType } from 'recharts/types/component/Tooltip'
import styled from 'styled-components/macro'
import theme from 'theme'
import ChartLegend from './ChartLegend'
import ChartTooltip from './ChartTooltips'

export type StackChartProps = {
	allMonth?: boolean
	data: Array<any>
	height?: number | string
	hasSafety: boolean
	target: number
	width?: number | string
	isPrinting?: boolean
	disabledTooltip?: boolean
	customTheme?: string
}

const StackChart = forwardRef<any, StackChartProps>(
	(
		{
			allMonth,
			customTheme,
			data,
			disabledTooltip,
			height = '99.9%',
			target,
			width = '99.9%',
			isPrinting,
			hasSafety
		},
		ref
	) => {
		const MONTHS = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		]

		const { t } = useTranslation('common')

		const [parsedData, setParsedData] = useState<Array<any>>([])
		const { theme: chartTheme } = useMeState()
		const thm = customTheme ? customTheme : chartTheme

		const StackCursor = ({ x, y, width, height }: any) => {
			return (
				<Rectangle
					fill={theme(thm).colors.neutral000}
					x={width / 2 + x - 0.5}
					y={y}
					width={1}
					height={height}
				/>
			)
		}

		const renderLegend: ContentType = ({ payload }) => <ChartLegend payload={payload} />
		const renderTooltip: TooltipContentType<ValueType, NameType> = ({
			active,
			payload
		}) => <ChartTooltip active={active} payload={payload} target={target} />

		const getPastTwelveMonths = () => {
			const today = new Date()
			const currentMonth = today.getMonth()
			const pastTwelveMonths = []

			for (let i = 0; i < 12; i++) {
				const month = new Date(today.getFullYear(), currentMonth - i, 1)
				const monthName = MONTHS[month.getMonth()]
				pastTwelveMonths.push(monthName)
			}

			return pastTwelveMonths.reverse()
		}

		useEffect(() => {
			const MONTHS = getPastTwelveMonths()

			const parsedData = MONTHS.map((month) => {
				console.log(data)
				const d = data.find(({ name }) => name === month)

				if (!isNil(d)) {
					if (hasSafety) {
						return {
							name: month.substring(0, 3),
							s1: d.s1,
							s2: d.s2,
							s3: d.s3,
							s4: d.s4,
							s5: d.s5,
							s6: d.s6
						}
					}
					return {
						name: month.substring(0, 3),
						s1: d.s1,
						s2: d.s2,
						s3: d.s3,
						s4: d.s4,
						s5: d.s5
					}
				}

				if (hasSafety) {
					return {
						name: month.substring(0, 3),
						s1: 0,
						s2: 0,
						s3: 0,
						s4: 0,
						s5: 0,
						s6: 0
					}
				}
				return {
					name: month.substring(0, 3),
					s1: 0,
					s2: 0,
					s3: 0,
					s4: 0,
					s5: 0
				}
			})

			setParsedData(parsedData)
		}, [data, allMonth, hasSafety])

		if (data.length <= 0) {
			return (
				<Wrapper>
					<EmptyStateWrapper>
						<EmptyStateText>
							<H as='h4'>{t('stackchart.emptyState.title')}</H>
							<Text>{t('stackchart.emptyState.text')}</Text>
						</EmptyStateText>
						{/* //todo: update button to display ios and android store instead */}
						<Button
							onClick={() =>
								window.open(
									'https://play.google.com/store/apps/details?id=com.goleansigma.audit&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1',
									'_blank'
								)
							}>
							{t('stackchart.emptyState.download')}
						</Button>
					</EmptyStateWrapper>
				</Wrapper>
			)
		}

		return (
			<Wrapper debounce={1} height={height} width={width}>
				<BarChart
					id='barchart'
					data={allMonth ? parsedData : data}
					margin={{
						bottom: 20,
						left: 20,
						right: 20,
						top: 20
					}}
					ref={ref}>
					{!isPrinting && <Legend content={renderLegend} />}
					<CartesianGrid color={theme(thm).colors.neutral004} vertical={false} />
					<YAxis
						axisLine={false}
						color={theme(thm).colors.neutral000}
						domain={[0, 100]}
						interval={0}
						orientation='right'
						scale='linear'
						tick={{ fill: theme(thm).colors.neutral002, fontWeight: '600' }}
						tickFormatter={(value) => `${value}%`}
						tickLine={false}
						tickMargin={20}
					/>
					<XAxis
						axisLine={false}
						color={theme(thm).colors.neutral004}
						dataKey='name'
						padding='gap'
						tick={{ fill: theme(thm).colors.neutral002, fontWeight: '600' }}
						tickMargin={20}
					/>
					<Bar barSize={30} dataKey='s1' fill={theme(thm).colors.s1} stackId='a' />
					<Bar barSize={30} dataKey='s2' fill={theme(thm).colors.s2} stackId='a' />
					<Bar barSize={30} dataKey='s3' fill={theme(thm).colors.s3} stackId='a' />
					<Bar barSize={30} dataKey='s4' fill={theme(thm).colors.s4} stackId='a' />
					<Bar barSize={30} dataKey='s5' fill={theme(thm).colors.s5} stackId='a' />
					{hasSafety && (
						<Bar barSize={30} dataKey='s6' fill={theme(thm).colors.s6} stackId='a' />
					)}

					<ReferenceLine
						stroke={theme(thm).colors.success}
						strokeDasharray='3 3'
						strokeWidth={2}
						y={target}
					/>
					{!isPrinting && !disabledTooltip && (
						<Tooltip content={renderTooltip} cursor={<StackCursor />} />
					)}
				</BarChart>
			</Wrapper>
		)
	}
)

const Wrapper = styled(ResponsiveContainer)`
	background-color: transparent;
`

export default StackChart
