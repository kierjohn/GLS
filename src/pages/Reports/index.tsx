import Button from '@system/Button'
import H from '@system/H'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import MainLayout from 'layout/MainLayout'
import { find } from 'lodash'
import { useAreasState } from 'providers/Areas'
import { AreaProps } from 'providers/Areas/types'
import { useFetchArea } from 'providers/Areas/useFetchArea'
import { useAuditsState } from 'providers/Audits'
import { useFetchMe } from 'providers/Me/useFetchMe'
import { FC, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'

const Reports: FC = () => {
	const { t } = useTranslation('common')
	const { data, isLoading } = useAreasState()
	const { data: audits } = useAuditsState()
	const { id } = useParams()
	const user = useFetchMe()

	const navigate = useNavigate()

	const [currentArea, setCurrentArea] = useState<AreaProps>()

	useEffect(() => {
		setCurrentArea(find(data, (area) => id === area.id))
	}, [id, data])

	useFetchArea()

	const onAreaItemClick = (value: AreaProps) => {
		navigate(`/reports/${value.id}`)
	}

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Reports</title>
			</Helmet>
			<Wrapper>
				<AreaWrapper>
					<List
						data={data}
						ghostLoading={{
							dataCount: 1,
							itemCount: 3
						}}
						hasPadding={false}
						isLoading={isLoading}
						isSmall
						itemFormat={(value) => (
							<>
								<Data
									isBlocked={true}
									isSmall
									text={value.location.name}
									value={value.title}
								/>
							</>
						)}
						title={t('reports.areas.title')}
						onListItemClick={onAreaItemClick}
					/>
				</AreaWrapper>
				<ChartWrapper>
					{Boolean(id) ? (
						<ChartHeader>
							<ChartTitle>{currentArea?.title}</ChartTitle>
							{currentArea && Boolean(audits.length) && (
								<Button
									variant='ghost'
									size='small'
									onClick={() =>
										navigate(
											`/r/${currentArea?.id}/${user.data.id}/${
												user.data.is6s ? '6s' : '5s'
											}`
										)
									}>
									{t('reports.downloadReports')}
								</Button>
							)}
						</ChartHeader>
					) : (
						<TextWrapper>
							<H as='h4'>{t('reports.placeholder')}</H>
						</TextWrapper>
					)}
					<Outlet />
				</ChartWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: calc(100% - 80px);
	width: 100%;
`

const AreaWrapper = styled.div`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-left: 1px solid ${(props) => props.theme.colors.neutral006};
	border-right: 1px solid ${(props) => props.theme.colors.neutral006};
	display: none;
	width: 320px;
	@media screen and (min-width: 992px) {
		display: flex;
	}
`

const ChartWrapper = styled.div`
	background: ${(props) => props.theme.colors.neutral007};
	display: flex;
	flex: 1;
	flex-direction: column;
	min-height: 100%;
	overflow: auto;
`

const ChartHeader = styled.div`
	align-items: center;
	display: flex;
	padding: 20px;
	@media screen and (min-width: 768px) {
		padding: 40px 30px;
	}
`

const ChartTitle = styled.div`
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	flex: 1;
`

const TextWrapper = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
	justify-content: center;
`

export default Reports
