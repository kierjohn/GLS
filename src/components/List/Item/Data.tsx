import React, { FC, memo, ReactNode } from 'react'
import styled, { css } from 'styled-components/macro'

export type ListItemDataProps = {
	desktopOnly?: boolean
	isBlocked?: boolean
	isCapitalized?: boolean
	isSmall?: boolean
	text?: string | ReactNode
	title?: string
	value: string | ReactNode
	width?: number
}

const Data: FC<ListItemDataProps> = memo(
	({
		desktopOnly = false,
		isBlocked = false,
		isCapitalized = false,
		isSmall = false,
		text,
		title,
		value,
		width
	}) => {
		return (
			<Wrapper
				desktopOnly={desktopOnly}
				isBlocked={isBlocked}
				title={title ? title : ''}
				width={width}>
				<Value isCapitalized={isCapitalized} isSmall={isSmall}>
					{value}
				</Value>
				<Text>{text}</Text>
			</Wrapper>
		)
	}
)

const Wrapper = styled.div<{ isBlocked: boolean; desktopOnly: boolean; width?: number }>`
	display: ${(props) => (props.desktopOnly ? 'none' : 'flex')};
	flex-direction: column;
	flex: ${(props) => (props.isBlocked ? '1' : 'none')};
	justify-content: center;
	margin-right: 20px;
	max-width: 100%;
	width: 160px;
	${(props) =>
		props.isBlocked
			? css`
					flex: 1;
			  `
			: css`
					width: ${props.width ? `${props.width}px` : '160px;'};
			  `}

	@media screen and (min-width: 1024px) {
		display: flex;
	}
`

const Value = styled.span<{ isCapitalized: boolean; isSmall: boolean }>`
	font-size: ${(props) =>
		props.isSmall ? props.theme.font.sizes.normal : props.theme.font.sizes.medium};
	font-weight: 700;
	margin-bottom: 5px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 24px;
	@media screen and (min-width: 992px) {
		text-transform: ${(props) => (props.isCapitalized ? 'capitalize' : 'none')};
	}
`

const Text = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.small};
	letter-spacing: 0.04em;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	@media screen and (min-width: 992px) {
		font-size: ${(props) => props.theme.font.sizes.normal};
	}
`

export default Data
