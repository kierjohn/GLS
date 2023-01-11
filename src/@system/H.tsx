import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components/macro'

export type HeaderWrapperProps = {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	color?:
		| 'primary'
		| 'neutral000'
		| 'neutral001'
		| 'neutral002'
		| 'neutral003'
		| 'neutral004'
		| 'neutral005'
		| 'neutral006'
		| 'warning'
		| 'danger'
	isUpperCase?: boolean
	letterSpacing?: string
	weight?: string
}

export type HeaderProps = HeaderWrapperProps & {
	children: ReactNode
}

const H: FC<HeaderProps> = ({
	as = 'h1',
	children,
	color = 'neutral000',
	isUpperCase,
	letterSpacing,
	weight = '900',
	...props
}: HeaderProps) => {
	return (
		<Wrapper
			{...props}
			as={as}
			color={color}
			isUpperCase={isUpperCase}
			letterSpacing={letterSpacing}
			weight={weight}>
			{children}
		</Wrapper>
	)
}

const h1 = css`
	font-size: ${(props) => props.theme.font.sizes.h1};
	margin-top: 0;
`

const h2 = css`
	font-size: ${(props) => props.theme.font.sizes.h2};
	margin-top: 0;
`

const h3 = css`
	font-size: ${(props) => props.theme.font.sizes.h3};
	margin-top: 0;
`

const h4 = css`
	font-size: ${(props) => props.theme.font.sizes.h4};
	margin-top: 0;
`

const h5 = css`
	font-size: ${(props) => props.theme.font.sizes.h5};
	margin-top: 0;
`

const h6 = css`
	font-size: ${(props) => props.theme.font.sizes.h6};
	margin-top: 0;
`

const Wrapper = styled.span<HeaderWrapperProps>`
	${(props) => {
		switch (props.as) {
			case 'h1':
				return h1
			case 'h2':
				return h2
			case 'h3':
				return h3
			case 'h4':
				return h4
			case 'h5':
				return h5
			case 'h6':
				return h6
			default:
				return h1
		}
	}}
	color: ${(props) =>
		props.color ? props.theme.colors[props.color] : props.theme.colors.neutral000};
	font-weight: ${(props) => props.weight};
	letter-spacing: ${(props) => props.letterSpacing};
	line-height: calc(1em + 14px);
	text-transform: ${(props) => (props.isUpperCase ? 'uppercase' : 'none')};
`

export default H
