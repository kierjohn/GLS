import { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components/macro'

export type TextProps = {
	children: ReactNode
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
	size?: 'small' | 'normal' | 'medium' | 'large'
}

const Text: FC<TextProps> = ({
	children,
	color = 'neutral000',
	size = 'normal',
	...rest
}: TextProps) => {
	return (
		<Wrapper color={color} size={size ? size : 'normal'} {...rest}>
			{children}
		</Wrapper>
	)
}

const small = css`
	font-size: ${(props) => props.theme.font.sizes.small};
`
const normal = css`
	font-size: ${(props) => props.theme.font.sizes.normal};
`
const medium = css`
	font-size: ${(props) => props.theme.font.sizes.medium};
`
const large = css`
	font-size: ${(props) => props.theme.font.sizes.large};
`

const Wrapper = styled.span<{ size: string; color: string }>`
	${(props) => {
		switch (props.size) {
			case 'small':
				return small
			case 'normal':
				return normal
			case 'medium':
				return medium
			case 'large':
				return large
		}
	}}
	color: ${(props) => props.theme.colors[props.color]};
	letter-spacing: 0.02em;
`

export default Text
