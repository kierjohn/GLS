import {
	ToastActions,
	ToastContextMessageProps,
	useToastDispatch,
	useToastState
} from 'providers/Toast'
import { map } from 'lodash'
import React, { FC, useCallback } from 'react'
import styled from 'styled-components/macro'
import Message from './Message'
import { createPortal } from 'react-dom'

const Toast: FC = () => {
	const { messages } = useToastState()
	const toastDispatch = useToastDispatch()
	const portal = document.getElementById('toastPortal') as HTMLElement

	const closeMessage = useCallback(
		(message: ToastContextMessageProps) => {
			toastDispatch({ type: ToastActions.remove, payload: message.id })
		},
		[toastDispatch]
	)
	const ToastComponent = (() => {
		return (
			<Wrapper>
				<MessagesWrapper>
					{map(messages, (message, index) => (
						<Message
							key={index}
							message={message}
							onClose={() => closeMessage(message)}
							onTimerEnd={() => closeMessage(message)}
						/>
					))}
				</MessagesWrapper>
			</Wrapper>
		)
	})()

	return createPortal(ToastComponent, portal)
}

const Wrapper = styled.div`
	align-items: flex-end;
	background: transparent;
	bottom: 30px;
	display: flex;
	flex-direction: column;
	overflow-y: hidden;
	position: fixed;
	width: 100%;
	z-index: 10002;
`

const MessagesWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	position: relative;
	width: 100%;
`

export default Toast
