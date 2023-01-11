import React, { FC, ReactNode } from 'react'
import styled from 'styled-components/macro'

export type TooltipProps = {
	children: ReactNode
	message: string
}

const Tooltip: FC<TooltipProps> = ({ children, message }) => {
	return (
		<Wrapper>
			{children}
			<TooltipWrapper>{message}</TooltipWrapper>
		</Wrapper>
	)
}

const TooltipWrapper = styled.div`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral000};
	border-radius: ${(props) => props.theme.radius.medium};
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	justify-content: center;
	letter-spacing: 0.02em;
	margin-top: 110%;
	opacity: 0;
	padding: 10px 20px;
	pointer-events: none;
	position: absolute;
	bottom: 0;
	transition: margin-top 150ms ease-in-out, opacity 150ms ease-in-out;
	white-space: nowrap;
	z-index: 100;
`

const Wrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	position: relative;
	&:hover {
		${TooltipWrapper} {
			margin-top: 100%;
			opacity: 1;
		}
	}
`

export default Tooltip
