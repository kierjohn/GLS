import MainLayout from 'layout/MainLayout'
import { map } from 'lodash'
import { useFetchAudits } from 'providers/Audits/useFetchAudits'
import { useMeState } from 'providers/Me'
import { FC, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components/macro'
import { getReport, getScore } from 'utils/helpers'
import Activites from './Activities'
import Overview from './Oveview'
import Reports from './Reports'
import Tasks from './Tasks'

const Dashboard: FC = () => {
	const { is6s } = useMeState()
	const { data, isLoading } = useFetchAudits({ standard: is6s ? '6s' : '5s' })
	const reports = useMemo(() => getReport(data), [data])
	const scores = map(data, ({ scores }) => scores).flat()

	const overViewData = {
		s1: getScore({ scores, name: 'S1' }),
		s2: getScore({ scores, name: 'S2' }),
		s3: getScore({ scores, name: 'S3' }),
		s4: getScore({ scores, name: 'S4' }),
		s5: getScore({ scores, name: 'S5' }),
		s6: getScore({ scores, name: 'S6' })
	}

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<Wrapper hasSafety={is6s}>
				<Overview hasSafety={is6s} data={overViewData} isLoading={isLoading} />
				<Activites />
				<Tasks />
				<Reports hasSafety={is6s} data={reports} isLoading={isLoading} />
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div<{ hasSafety: boolean }>`
	display: grid;
	grid-gap: 20px;
	grid-template-columns: repeat(${(props) => (props.hasSafety ? 6 : 5)}, 1fr);
	padding: 20px;
`

export default Dashboard
