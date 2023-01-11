import Card from 'components/Card'
import Placeholder from 'components/Placeholder'
import StackChart from 'components/StackChart'
import { useMeState } from 'providers/Me'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export type DasboardReportDataProps = {
	name: string
	s1: number
	s2: number
	s3: number
	s4: number
	s5: number
	s6: number
}

export type DashboardReportProps = {
	data?: Array<DasboardReportDataProps> | undefined
	isLoading: boolean
	hasSafety: boolean
}

const Reports: FC<DashboardReportProps> = ({ data, isLoading, hasSafety }) => {
	const { t } = useTranslation('common')
	const { targetScore } = useMeState()
	return (
		<Wrapper>
			<CardWrapper>
				<Header>
					<Title>
						{hasSafety ? '6S' : '5S'} - {t('dashboard.reports.title')}
					</Title>
					<Range>{t('dashboard.report.range')}</Range>
				</Header>
				{isLoading ? (
					<Placeholder>Loading</Placeholder>
				) : (
					<StackChart
						hasSafety={hasSafety}
						allMonth
						data={data ? data : []}
						target={targetScore}
						height={600}
					/>
				)}
			</CardWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	grid-column: span 6;
	@media screen and (min-width: 992px) {
		grid-column: 3/7;
		grid-row: 3/4;
	}
`
const CardWrapper = styled(Card)`
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-bottom: 0;
`

const Header = styled.div`
	align-items: center;
	background: none;
	display: flex;
	padding: 20px;
	width: 100%;
`

const Title = styled.span`
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 800;
	margin-right: auto;
`

const Range = styled.span`
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 800;
	padding: 3px 12px;
	border-radius: 10px;
	border: 1px solid ${(props) => props.theme.colors.neutral003};
`

export default Reports
