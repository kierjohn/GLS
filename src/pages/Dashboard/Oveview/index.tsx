import RadialChart from 'pages/Dashboard/Oveview/RadialChart'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import { roundDataSixS } from 'utils/helpers'
export type OverviewProps = {
	data: {
		s1: { score: number; length: number; maxPoints: number }
		s2: { score: number; length: number; maxPoints: number }
		s3: { score: number; length: number; maxPoints: number }
		s4: { score: number; length: number; maxPoints: number }
		s5: { score: number; length: number; maxPoints: number }
		s6: { score: number; length: number; maxPoints: number }
	}
	isLoading: boolean
	hasSafety: boolean
}

const Overview: FC<OverviewProps> = ({ data, isLoading, hasSafety }) => {
	const { t } = useTranslation('common')

	return (
		<Wrapper hasSafety={hasSafety}>
			<RadialChart
				isLoading={isLoading}
				color='#F7B94D'
				data={[
					{
						name: 's1',
						value: roundDataSixS({ ...data.s1 })
					}
				]}
				radius={130}
				title={t('6s.s1')}
			/>
			<RadialChart
				isLoading={isLoading}
				color='#90EB5B'
				data={[
					{
						name: 's2',
						value: roundDataSixS({ ...data.s2 })
					}
				]}
				radius={130}
				title={t('6s.s2')}
			/>
			<RadialChart
				isLoading={isLoading}
				color='#6CD6E5'
				data={[
					{
						name: 's3',
						value: roundDataSixS({ ...data.s3 })
					}
				]}
				radius={130}
				title={t('6s.s3')}
			/>
			<RadialChart
				isLoading={isLoading}
				color='#8892E7'
				data={[
					{
						name: 's4',
						value: roundDataSixS({ ...data.s4 })
					}
				]}
				radius={130}
				title={t('6s.s4')}
			/>
			<RadialChart
				isLoading={isLoading}
				color='#D39EDB'
				data={[
					{
						name: 's5',
						value: roundDataSixS({ ...data.s5 })
					}
				]}
				radius={130}
				title={t('6s.s5')}
			/>
			{hasSafety && (
				<RadialChart
					isLoading={isLoading}
					color='#E67A81'
					data={[
						{
							name: 's6',
							value: roundDataSixS({ ...data.s6, maxPoints: 3 })
						}
					]}
					radius={130}
					title={t('6s.s6')}
				/>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div<{ hasSafety: boolean }>`
	display: grid;
	grid-column: span 6;
	grid-gap: 20px;
	grid-template-columns: repeat(${(props) => (props.hasSafety ? 6 : 5)}, 1fr);
	width: 100%;
	height: 210px;
	overflow: auto;
`

export default Overview
