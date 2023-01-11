import { ReactComponent as TimesIcon } from 'icons/times.svg'
import { lighten, transparentize } from 'polished'
import { ToastContextMessageProps, ToastTypes } from 'providers/Toast'
import React, { FC, useEffect } from 'react'
import styled, { css, keyframes } from 'styled-components/macro'

export type ToastMessageProps = {
	message: ToastContextMessageProps
	onClose: () => void
	onTimerEnd: () => void
}

const Message: FC<ToastMessageProps> = ({ message, onClose, onTimerEnd }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onTimerEnd()
		}, message.timer)

		return () => {
			clearTimeout(timer)
		}
	}, [message.timer, onTimerEnd])

	return (
		<Wrapper variant={message?.type}>
			<Text>{message.text}</Text>
			<Close onClick={onClose} variant={message?.type}>
				<TimesIcon />
			</Close>
		</Wrapper>
	)
}

const slideUp = keyframes`
	from {
		opacity: 0;
		transform: translateY(50px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`

const Wrapper = styled.div<{ variant: string | undefined }>`
	align-items: center;
	animation: ${slideUp} 250ms ease-in-out;
	background: ${(props) => props.theme.colors.primary};
	border-radius: ${(props) => props.theme.radius.medium};
	border: 1px solid ${(props) => lighten(0.1, props.theme.colors.primary)};
	box-shadow: ${(props) => props.theme.shadows.wide};
	display: flex;
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 400;
	letter-spacing: 0.04em;
	margin-bottom: 10px;
	padding: 10px 10px 10px 20px;
	position: relative;
	transition: all 250ms ease-in-out;
	z-index: 1000;
	max-width: 90%;
	${(props) => {
		switch (props.variant) {
			case ToastTypes.danger:
				return css`
					background: ${(props) => props.theme.colors.danger};
					border-color: ${(props) => lighten(0.1, props.theme.colors.danger)};
					color: ${(props) => props.theme.colors.neutral001};
				`
		}
	}}
`

const Text = styled.div`
	color: #fff;
	margin-right: 10px;
	line-height: calc(1em + 5px);
`

const Close = styled.button<{ variant: string | undefined }>`
	background: transparent;
	border-radius: ${(props) => props.theme.radius.small};
	border: none;
	color: #fff;
	cursor: pointer;
	height: 30px;
	width: 30px;
	&:hover {
		background: ${(props) => transparentize(0.75, props.theme.colors.neutral001)};
		opacity: 0.75;
	}
`

export default Message
