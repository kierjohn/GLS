import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import Card from 'components/Card'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import { ReactComponent as ArrowTopRightIcon } from 'icons/arrowTopRight.svg'
import { useAreasState } from 'providers/Areas'
import { useFetchFilteredAreas } from 'providers/Areas/useFetchFilteredAreas'
import { useFetchFilteredLocations } from 'providers/Locations/useFetchFilteredLocations'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const AreaLocation: FC = () => {
	const { t } = useTranslation('common')
	const { data: areas, isLoading: isAreasLoading } = useAreasState()

	useFetchFilteredLocations({
		limit: 6,
		order: 'desc',
		page: 1,
		search: '',
		sort: 'createdAt'
	})
	useFetchFilteredAreas({
		limit: 6,
		order: 'desc',
		page: 1,
		search: '',
		sort: 'createdAt',
		type: ''
	})

	return (
		<Wrapper>
			<CardWrapper>
				<Header>
					<TitleContainer>
						<Title>{t('dashboard.areas.title')}</Title>
					</TitleContainer>
					<Button to='/areas' size='small'>
						<ArrowTopRightIcon /> {t('dashboard.areas.manageAreas')}
					</Button>
				</Header>
				<List
					data={areas}
					emptyStateAction={
						<Button to='/areas' variant='light'>
							<ArrowTopRightIcon /> {t('dashboard.areas.manageAreas')}
						</Button>
					}
					emptyStatetext={
						<>
							<H as='h4'>{t('areas.emptyState.title')}</H>
							<Text>{t('areas.emptyState.text')}</Text>
						</>
					}
					ghostLoading={{
						dataCount: 3,
						itemCount: 4
					}}
					isLoading={isAreasLoading}
					hasPadding={false}
					hasMargin={false}
					itemFormat={(value) => (
						<>
							<Data
								value={value.title}
								text={value.description ? value.description : '-'}
								isBlocked={true}
							/>
						</>
					)}
				/>
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
	padding: 30px;
`

const Header = styled.div`
	align-items: baseline;
	display: flex;
	margin-bottom: 30px;
	width: 100%;
`

const TitleContainer = styled.div`
	display: flex;
	margin-right: auto;
	align-items: baseline;
`

const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	margin-right: 20px;
`

export default AreaLocation
