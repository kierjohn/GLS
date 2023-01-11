import MainLayout from 'layout/MainLayout'
import { filter, map, sortBy, uniqBy } from 'lodash'
import { useAuditsState } from 'providers/Audits'
import { AuditScoreProps } from 'providers/Audits/types'
import { useFetchAudit } from 'providers/Audits/useFetchAudit'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled, { useTheme } from 'styled-components/macro'
import Filter from './Filter'
import Item from './Item'

const AuditDetails = () => {
	const params = useParams()
	const { details } = useAuditsState()
	const theme = useTheme()
	const [hasDeviation, setHasDeviation] = useState<number>(0)

	/* eslint-disable */
	const scores: Array<AuditScoreProps> = useMemo(() => {
		switch (hasDeviation) {
			case 1:
				return filter(details.scores, (score: AuditScoreProps) => score.hasDeviation)
			case 2:
				return filter(details.scores, (score: AuditScoreProps) => !score.hasDeviation)
			default:
				return details.scores
		}
	}, [details.scores, hasDeviation])

	const categories: Array<{ name: string; description: string }> = useMemo(
		() =>
			sortBy(
				uniqBy(
					map(scores, (score: AuditScoreProps) => {
						return { name: score.categoryName, description: score.categoryDescription }
					}),
					'name'
				),
				'name'
			),
		[scores, hasDeviation]
	)
	/* eslint-disable */

	useFetchAudit({ id: `${params.id}` })

	return (
		<MainLayout isApp>
			<Wrapper>
				<Filter hasDeviation={hasDeviation} setHasDeviation={setHasDeviation} />

				<AuditWrapper>
					<Header>
						<Title>
							{details?.area?.title} - {details.createdAt.toFormat('DD')}
						</Title>
					</Header>
					{map(
						categories,
						({ name, description }: { name: string; description: string }) => {
							return (
								<AuditScoresWrapper key={name}>
									<CategoryTitle>
										{name} {description ? `- ${description}` : ''}
									</CategoryTitle>
									<ScoresWrapper>
										{map(
											sortBy(
												filter(scores, (score) => score.categoryName === name),
												'order'
											),
											(
												{
													categoryName,
													comment,
													hasDeviation,
													image,
													maxPoints,
													order,
													question,
													score
												},
												index
											) => {
												return (
													<Item
														key={index}
														color={theme.colors[categoryName?.toLocaleLowerCase()]}
														score={score}
														question={question}
														hasDeviation={hasDeviation}
														comment={comment}
														image={image}
														category={categoryName}
														order={order}
														maxPoints={maxPoints}
													/>
												)
											}
										)}
									</ScoresWrapper>
								</AuditScoresWrapper>
							)
						}
					)}
				</AuditWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	width: 100%;
`
const AuditWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	height: auto;
	@media screen and (min-width: 992px) {
		margin-left: 300px;
	}
`

const AuditScoresWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 100%;
	overflow: visible;
`

const ScoresWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	width: 100%;
`

const CategoryTitle = styled.h4`
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 700;
	margin-bottom: 20px;
`

const Header = styled.div`
	align-items: center;
	display: flex;
	height: 100px;
	padding: 20px 0;
	width: 100%;

	@media screen and (min-width: 992px) {
		padding: 20px;
	}
`

const Title = styled.h2`
	font-size: ${(props) => props.theme.font.sizes.h4};
	margin-right: auto;
`
export default AuditDetails
