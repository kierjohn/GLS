import React, { FC } from 'react'
import styled, { css, keyframes } from 'styled-components/macro'

export type LoaderProps = {
	isModal?: boolean
}

const Loader: FC<LoaderProps> = ({ isModal = false }) => {
	return (
		<Wrapper isModal={isModal}>
			<Content>
				<Line delay={500} width={30}></Line>
				<Line delay={300} width={40}></Line>
				<Line delay={100} width={50}></Line>
			</Content>
		</Wrapper>
	)
}

const flicker = keyframes`
	0% {
		opacity: 1
	}
	50% {
		opacity: 0.25
	}
	100% {
		opacity: 1
	}
`

const Wrapper = styled.div<{ isModal: boolean }>`
	align-items: center;
	display: flex;
	flex: 1;
	height: 100vh;
	justify-content: center;
	width: 100%;
	${(props) =>
		props.isModal &&
		css`
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			width: auto;
			height: 100%;
			background: ${(props) => props.theme.colors.neutral007};
			z-index: 100;
		`}
`

const Content = styled.div`
	align-items: baseline;
	display: flex;
	flex-direction: column;
`

const Line = styled.span<{ delay: number; width: number }>`
	animation: 1s ${flicker} ${(props) => props.delay}ms linear infinite;
	background: ${(props) => props.theme.colors.neutral003};
	display: flex;
	height: 10px;
	margin-bottom: 10px;
	margin-left: auto;
	margin-right: ${(props) => props.width / 3}px;
	width: ${(props) => props.width}px;
`

export default Loader
