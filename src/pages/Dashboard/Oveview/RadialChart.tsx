import Card from 'components/Card'
import React, { FC, memo } from 'react'
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts'
import styled, { useTheme } from 'styled-components/macro'

type RadialChartDataProps = {
	name: string
	value: number
}
export type RadialChartProps = {
	color: string
	data: Array<RadialChartDataProps>
	isLoading: boolean
	radius: number
	title: string
}
const RadialChart: FC<RadialChartProps> = memo(
	({ color, data, isLoading, radius, title }) => {
		const theme = useTheme()
		return (
			<>
				{isLoading ? (
					<Wrapper>
						<CardWrapper>
							<RadialBarChart
								barSize={20}
								cx={radius / 2}
								cy={radius / 2}
								data={[{ name: 'loading', value: '0' }]}
								endAngle={-270}
								height={radius}
								innerRadius='83%'
								outerRadius='100%'
								startAngle={90}
								width={radius}>
								<PolarAngleAxis
									angleAxisId={0}
									domain={[0, 100]}
									tick={false}
									type='number'
								/>
								<RadialBar
									background
									cornerRadius={3}
									dataKey='value'
									fill={theme.colors.neutral004}
								/>
								<text
									className='radialBarChartValue'
									dominantBaseline='middle'
									textAnchor='middle'
									fill={theme.colors.neutral004}
									x={radius / 2}
									y={radius / 2 + 3}>
									00
								</text>
							</RadialBarChart>
							<Title>{title}</Title>
						</CardWrapper>
					</Wrapper>
				) : (
					<Wrapper>
						<CardWrapper color={data[0].value ? color : theme.colors.neutral004}>
							<RadialBarChart
								barSize={20}
								cx={radius / 2}
								cy={radius / 2}
								data={data}
								endAngle={-270}
								height={radius}
								innerRadius='83%'
								outerRadius='100%'
								startAngle={90}
								width={radius}>
								<PolarAngleAxis
									angleAxisId={0}
									domain={[0, 100]}
									tick={false}
									type='number'
								/>
								<RadialBar background cornerRadius={3} dataKey='value' fill={color} />
								<text
									className='radialBarChartValue'
									dominantBaseline='middle'
									textAnchor='middle'
									x={radius / 2}
									y={radius / 2 + 3}>
									{data[0].value ? data[0].value : '00'}%
								</text>
							</RadialBarChart>
							<Title>{title}</Title>
						</CardWrapper>
					</Wrapper>
				)}
			</>
		)
	}
)

const Wrapper = styled.div`
	grid-column: 1fr;
`

const CardWrapper = styled(Card)<{ color?: string }>`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: center;
	margin-bottom: 0;
	padding: 20px;
	height: 100%;

	&:last-child {
		margin-right: 0;
	}
	& .radialBarChartValue {
		fill: ${(props) => props.color};
		font-size: ${(props) => props.theme.font.sizes.h4};
		font-weight: 600;
	}
	& .radialBarChartText {
		fill: ${(props) => props.theme.colors.neutral003};
		font-size: ${(props) => props.theme.font.sizes.medium};
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
`

const Title = styled.h4`
	font-size: ${(props) => props.theme.font.sizes.h5};
	font-weight: 600;
	letter-spacing: 0.04em;
`

export default RadialChart
