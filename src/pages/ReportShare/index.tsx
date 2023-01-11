import { FC } from 'react'
import { Helmet } from 'react-helmet'
import { Outlet } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components/macro'
import theme from 'theme'

const ReportShare: FC = () => {
	return (
		<ThemeProvider theme={theme('light')}>
			<Wrapper>
				<Helmet>
					<title>Reports</title>
				</Helmet>
				<ChartWrapper>
					<Outlet />
				</ChartWrapper>
			</Wrapper>
		</ThemeProvider>
	)
}

const Wrapper = styled.div`
	background-color: ${(props) => props.theme.colors.neutral004};
	display: flex;
	flex: 1;
	height: 100vh;
	width: 100%;
`

const ChartWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

export default ReportShare
