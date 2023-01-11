import Card from 'components/Card'
import ErrorImage from 'images/errorImage.png'
import { darken } from 'polished'
import { FC, MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export type AuditItemProps = {
	category: string
	color?: string
	comment?: string
	hasDeviation: boolean
	image?: string
	maxPoints: number
	order: number
	question: string
	score: number
	example?: string
}
const Item: FC<AuditItemProps> = ({
	category,
	color = '',
	comment,
	hasDeviation,
	image,
	order,
	question,
	score
}) => {
	const { t } = useTranslation('common')
	const [deviationPosition, setDeviationPosition] = useState({
		initPosition: '{ top: 0}',
		slideInAnimation: 'opacity: 1;margin-top: 50px;display: flex;'
	})

	const setDeviationDetailsPosition = (e: MouseEvent) => {
		if (e?.nativeEvent?.view?.innerHeight) {
			if (e.clientY + 400 <= e?.nativeEvent?.view?.innerHeight) {
				setDeviationPosition({
					initPosition: ' top: 0',
					slideInAnimation: 'opacity: 1; margin-top: 50px; '
				})
			} else {
				setDeviationPosition({
					initPosition: 'bottom: 0',
					slideInAnimation: 'opacity: 1;margin-bottom: 50px;'
				})
			}
		}
	}

	return (
		<Wrapper>
			<Header>
				<Category color={color}>{category}</Category>
				<Title>
					{t('audits.item.question')} {order}
				</Title>
			</Header>
			<Body>
				<Question>{question}</Question>
			</Body>
			<Score
				hasDeviation={hasDeviation}
				onMouseEnter={setDeviationDetailsPosition}
				animation={deviationPosition.slideInAnimation}>
				{score}
				{hasDeviation && (comment || image) && (
					<DeviationDetails animationInitPosition={deviationPosition.initPosition}>
						{image && (
							<Image>
								<img
									onError={(e) => {
										e.currentTarget.src = ErrorImage
									}}
									src={`${process.env.REACT_APP_API_URL}/public/images/audit/${image}`}
									alt={comment}
								/>
							</Image>
						)}
						{comment && <Comment>{comment}</Comment>}
					</DeviationDetails>
				)}
			</Score>
		</Wrapper>
	)
}

const Wrapper = styled(Card)`
	padding: 15px;
	margin-bottom: 10px;
	display: flex;
	align-items: flex-start;
	width: 100%;
	position: relative;
	overflow: visible;
`

const Header = styled.div`
	display: flex;
	align-items: center;
	width: 160px;
	grid-gap: 10px;
`

const Category = styled.span<{ color: string }>`
	align-items: center;
	background-color: ${(props) =>
		props.color ? props.color : props.theme.colors.neutral000};
	border-radius: ${(props) => props.theme.radius.small};
	border: 1px solid
		${(props) => darken(0.15, props.color ? props.color : props.theme.colors.neutral002)};
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	flex-wrap: nowrap;
	font-weight: 700;
	height: 30px;
	justify-content: center;
	width: 30px;
`

const Title = styled.span`
	font-size: 16px;
	font-weight: 600;
	white-space: nowrap;
`

const DeviationDetails = styled.div<{ animationInitPosition: string }>`
	box-shadow: 0 20px 66px 0 rgba(34, 48, 73, 0.2);
	background: ${(props) => props.theme.colors.neutral001};
	width: fit-content;
	position: absolute;
	right: 0;
	z-index: 100;
	border-radius: 7px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	padding: 20px;
	margin-top: 0;
	opacity: 0;
	pointer-events: none;
	transition: all 250ms ease-in-out;
	${(props) => props.animationInitPosition}
`

const Score = styled.div<{ hasDeviation: boolean; animation: string }>`
	align-items: center;
	background-color: ${(props) =>
		props.hasDeviation ? props.theme.colors.danger : props.theme.colors.success};
	border-radius: ${(props) => props.theme.radius.round};
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	flex: none;
	font-size: 14px;
	font-weight: 800;
	height: 30px;
	justify-content: center;
	margin-left: auto;
	width: 30px;
	cursor: pointer;
	& > svg {
		height: 12px;
		width: 12px;
	}

	&:hover {
		& > ${DeviationDetails} {
			${(props) => props.animation}
		}
	}
`

const Body = styled.div`
	display: none;
	flex: 1;
	@media screen and (min-width: 992px) {
		display: flex;
		margin-right: 10px;
	}
`

const Question = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	margin-bottom: 0;
	font-weight: 600;
	width: auto;
`

const Image = styled.div`
	& > img {
		border-radius: 5px;
		object-fit: cover;
		width: 100%;
		height: auto;

		@media screen and (min-width: 768px) {
			width: 400px;
			height: 400px;
		}
	}
`

const Comment = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 14px;
	font-weight: 600;
	line-height: 20px;
	margin: 0;
	margin-bottom: 10px;
`

export default Item
