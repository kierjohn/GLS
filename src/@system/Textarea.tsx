import { FC, FormEvent, useState } from 'react'
import styled, { css } from 'styled-components/macro'

export type TextareaProps = {
	error?: string
	isBlocked?: boolean
	label?: string
	maxlength?: number
	placeholder?: string
	value: string | number
	onBlur?: (e: FormEvent<HTMLTextAreaElement>) => void
	onChange: (e: FormEvent<HTMLTextAreaElement>) => void
	onFocus?: (e: FormEvent<HTMLTextAreaElement>) => void
}

const Textarea: FC<TextareaProps> = ({
	error,
	isBlocked = false,
	label,
	maxlength,
	placeholder,
	value,
	onBlur,
	onChange,
	onFocus,
	...rest
}: TextareaProps) => {
	const [isFocus, setIsFocus] = useState<boolean>(false)

	return (
		<Wrapper
			{...rest}
			isBlocked={isBlocked}
			hasError={Boolean(error)}
			hasLabel={Boolean(label)}
			isFocus={isFocus}>
			<InputWrapper
				onBlur={(e) => {
					setIsFocus(false)
					onBlur && onBlur(e)
				}}
				onChange={(e) => {
					onChange(e)
				}}
				onFocus={(e) => {
					setIsFocus(true)
					onFocus && onFocus(e)
				}}
				maxLength={maxlength}
				placeholder={placeholder}
				value={value}></InputWrapper>
			{label && (
				<Label isActive={Boolean(`${value}`.trim()) || isFocus || Boolean(placeholder)}>
					{label}
				</Label>
			)}
			<Error>{error}</Error>
		</Wrapper>
	)
}

const Wrapper = styled.div<{
	isBlocked: boolean
	hasError: boolean
	hasLabel: boolean
	isFocus: boolean
}>`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-radius: 3px;
	border: 1px solid
		${(props) =>
			props.isFocus
				? props.hasError
					? props.theme.colors.danger
					: props.theme.colors.neutral000
				: props.hasError
				? props.theme.colors.danger
				: props.theme.colors.neutral002};
	display: flex;
	flex-direction: column-reverse;
	height: 100px;
	padding: 11px 15px;
	position: relative;
	text-align: left;
	transition: all 250ms ease-in-out;
	width: ${(props) => (props.isBlocked ? '100%' : 'auto')};
	box-shadow: ${(props) =>
		props.isFocus
			? `0 0 0 1px ${
					props.hasError ? props.theme.colors.danger : props.theme.colors.primary
			  }`
			: 'none'};
`

const Label = styled.label<{ isActive: boolean }>`
	background-color: ${(props) => props.theme.colors.neutral001};
	color: ${(props) =>
		props.isActive ? props.theme.colors.neutral000 : props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.medium};
	left: 10px;
	padding: 0 5px;
	position: absolute;
	top: 14px;
	transform-origin: left;
	transition: all 250ms ease-in-out;
	z-index: 0;
	${(props) =>
		props.isActive &&
		css`
			top: -10px;
			transform: scale(0.8);
		`}
`

const InputWrapper = styled.textarea`
	background: none;
	border-radius: ${(props) => props.theme.radius.small};
	color: ${(props) => props.theme.colors.neutral000};
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.medium};
	height: 100%;
	outline: none;
	resize: none;
	z-index: 1;
`
const Error = styled.div`
	bottom: -15px;
	color: ${(props) => props.theme.colors.danger};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	left: 0;
	position: absolute;
`
export default Textarea
