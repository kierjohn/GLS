import React, { forwardRef, ReactNode } from 'react'
import styled from 'styled-components/macro'

export type CardProps = {
	children: ReactNode
	className?: string
	hasPadding?: boolean
	isFloating?: boolean
	shadow?: 'default' | 'light' | 'wide'
	width?: string
	onClick?: (props: any) => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			children,
			className,
			hasPadding = true,
			isFloating = false,
			shadow = 'default',
			width,
			onClick,
			...rest
		},
		ref
	) => {
		return (
			<Wrapper
				hasPadding={hasPadding}
				isFloating={isFloating}
				onClick={(e) => onClick && onClick(e)}
				ref={ref}
				shadow={shadow}
				width={width}
				className={className}
				{...rest}>
				{children}
			</Wrapper>
		)
	}
)

const Wrapper = styled.div<{
	width?: string
	hasPadding: boolean
	isFloating: boolean
	shadow: string
}>`
	border-radius: ${(props) => props.theme.radius.medium};
	background-color: ${(props) => props.theme.colors.neutral001};
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	/* box-shadow: ${(props) => {
		switch (props.shadow) {
			case 'light':
				return `${props.theme.shadows.light}`
			case 'wide':
				return `${props.theme.shadows.wide}`
			default:
				return `${props.theme.shadows.default}`
		}
	}}; */
	margin-bottom: 20px;
	width: ${(props) => (props.width ? `calc(${props.width} - 2px)` : 'auto')};
	overflow: hidden;

	@media screen and (min-width: 992px) {
		padding: ${(props) => (props.hasPadding ? '10px' : '0px')};
	}
`

export default Card
