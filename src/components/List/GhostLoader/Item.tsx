import { map } from 'lodash'
import { FC, memo } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ItemWrapper, Wrapper } from '../Item'

export type GhostListItemFormatProps = {
	isBlocked: boolean
	labelWidth: number
	valueWidth: number
}

export type GhostListItemProps = {
	format: Array<GhostListItemFormatProps>
	isSmall: boolean
}

const GhostItem: FC<GhostListItemProps> = memo(({ format, isSmall }) => (
	<Wrapper isSmall={isSmall}>
		<ItemWrapper isSingle>
			{map(format, ({ isBlocked, valueWidth, labelWidth }, key) => (
				<GhostInfoWrapper isBlocked={isBlocked} key={key} isSmall={isSmall}>
					<GhostValue width={valueWidth} />
					<GhostLabel width={labelWidth} />
				</GhostInfoWrapper>
			))}
		</ItemWrapper>
	</Wrapper>
))

const GhostInfoWrapper = styled.div<{ isBlocked: boolean; isSmall: boolean }>`
	display: flex;
	flex-direction: column;
	flex: ${(props) => (props.isBlocked ? '1' : 'none')};
	margin-right: 40px;
	width: ${(props) => (props.isBlocked ? 'auto' : '160px')};
`

const flicker = keyframes`
	0% {
		opacity: 1
	}
	50% {
		opacity: .25
	}
	100% {
		opacity: 1
	}

`
const GhostValue = styled.div<{ width: number }>`
	background: ${(props) => props.theme.colors.neutral004};
	border-radius: ${(props) => props.theme.radius.small};
	height: 24px;
	margin-bottom: 5px;
	width: ${(props) => props.width}px;
	animation: ${flicker} 3s linear infinite;
`

const GhostLabel = styled.div<{ width: number }>`
	background: ${(props) => props.theme.colors.neutral005};
	border-radius: ${(props) => props.theme.radius.small};
	height: 20px;
	width: ${(props) => props.width}px;
	animation: ${flicker} 4s linear infinite;
`

export default GhostItem
