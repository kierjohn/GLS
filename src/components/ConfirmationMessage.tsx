import Button from '@system/Button'
import Input from '@system/Input'
import { isNil } from 'lodash'
import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components/macro'
import Modal from './Modal'
import { useTranslation } from 'react-i18next'

export type ConfirmationMessageProps = {
	confirmText?: string
	doneIcon?: ReactNode
	doneText?: string
	isDanger?: boolean
	isLoading?: boolean
	isVisible: boolean
	message: string | ReactNode
	title: string
	onClose: (props?: any) => any
	onDone: (props?: any) => any
}

const ConfirmationMessage: FC<ConfirmationMessageProps> = ({
	confirmText,
	doneIcon,
	doneText = 'Done',
	isDanger = false,
	isLoading = false,
	isVisible = false,
	message,
	title,
	onClose,
	onDone
}) => {
	const { t } = useTranslation('common')
	const [confirmValue, setConfirmValue] = useState<string>('')
	const [isInputValid, seIsInputValid] = useState<boolean>(true)

	return (
		<Modal
			isVisible={isVisible}
			title={title}
			onClose={() => {
				setConfirmValue('')
				seIsInputValid(true)
				onClose()
			}}>
			<Message>{message}</Message>
			<ActionWrapper>
				{!isNil(confirmText) && (
					<Input
						error={!isInputValid ? t('confirmation.didntMatch') : ''}
						label=''
						onChange={(e) => setConfirmValue(e.currentTarget.value)}
						value={confirmValue}
					/>
				)}
				<Button
					isBlocked
					onClick={() => {
						if (confirmText) {
							if (confirmText === confirmValue) {
								seIsInputValid(true)
								setConfirmValue('')
								onDone()
							} else {
								seIsInputValid(false)
							}
						} else {
							onDone()
						}
					}}
					loading={isLoading}
					variant={isDanger ? 'danger' : 'primary'}>
					{doneIcon}
					{doneText}
				</Button>
			</ActionWrapper>
		</Modal>
	)
}

const Message = styled.div`
	color: ${(props) => props.theme.colors.neutral002};
	font-size: ${(props) => props.theme.font.sizes.medium};
	padding-bottom: 20px;

	& p * {
		font-size: 100%;
	}
`

const ActionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	& > * {
		margin-bottom: 20px;
	}
`

export default ConfirmationMessage
