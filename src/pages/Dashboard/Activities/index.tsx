import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import Card from 'components/Card'
import { EmptyStateText, EmptyStateWrapper } from 'components/List'
import GhostLoader from 'components/List/GhostLoader'
import { ReactComponent as ArrowTopRightIcon } from 'icons/arrowTopRight.svg'
import { ReactComponent as ClickIcon } from 'icons/clickBig.svg'
import { map, size } from 'lodash'
import Activity from 'pages/Dashboard/Activities/Activity'
import { useAuditsState } from 'providers/Audits'
import { useFetchFilteredAudits } from 'providers/Audits/useFetchFilteredAudits'
import { useMeState } from 'providers/Me'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'

const Activites = () => {
	const { t } = useTranslation('common')
	const navigate = useNavigate()

	const { data, isLoading } = useAuditsState()
	const { id, is6s } = useMeState()
	useFetchFilteredAudits({
		limit: 12,
		page: 1,
		standard: is6s ? '6s' : '5s',
		userId: id,
		isShort: 'all'
	})

	return (
		<Wrapper>
			<CardWrapper>
				<Header>
					<Title>{t('activities.title')}</Title>
					{size(data) >= 10 && (
						<Button size='small' to='/audits'>
							<ArrowTopRightIcon />
							{t('activities.seeAll')}
						</Button>
					)}
				</Header>
				{isLoading && (
					<Body>
						<GhostLoader dataCount={1} itemCount={5} min={100} max={240} />
					</Body>
				)}
				{!isLoading && Boolean(size(data)) && (
					<Body>
						{map(data, ({ id, createdAt, area, checklist }) => {
							return (
								<Activity
									date={createdAt}
									description=''
									id={id}
									isShort={Boolean(checklist.isShort)}
									key={id}
									standard={`${checklist.standard}`}
									title={`${area?.title}`}
									type={''}
									onClick={() => navigate(`/audits/${id}`)}
								/>
							)
						})}
						{size(data) >= 10 && (
							<Button isBlocked variant='link' to='/audits'>
								{t('activities.seeAll')}
							</Button>
						)}
					</Body>
				)}
				{!isLoading && !Boolean(size(data)) && (
					<EmptyStateWrapper>
						<EmptyStateText>
							<EmptyStateIcon>
								<ClickIcon />
							</EmptyStateIcon>
							<H as='h4'>{t('activities.emptyState.title')}</H>
							<Text>{t('activities.emptyState.text')}</Text>
						</EmptyStateText>
					</EmptyStateWrapper>
				)}
			</CardWrapper>
		</Wrapper>
	)
}
const Wrapper = styled.div`
	grid-column: span 6;
	@media screen and (min-width: 992px) {
		grid-column: 1/3;
		grid-row: 2/4;
	}
`

const CardWrapper = styled(Card)`
	display: flex;
	flex-direction: column;
	height: 100%;
	margin-right: 10px;
	padding: 20px;
	width: 100%;
`

const Header = styled.div`
	align-items: center;
	display: flex;
	margin-bottom: 30px;
	width: 100%;
`

export const Body = styled.div`
	display: flex;
	flex-direction: column;
`

const Title = styled.h4`
	flex: 1;
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 800;
`

const EmptyStateIcon = styled.div`
	display: flex;
	color: ${(props) => props.theme.colors.neutral004};
`

export default Activites
