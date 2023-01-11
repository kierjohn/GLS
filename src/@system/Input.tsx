import { FC, FormEvent, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { ReactComponent as CloseIcon } from 'icons/times.svg'

export type InputProps = {
	disabled?: boolean
	error?: string
	hasClear?: boolean
	isBlocked?: boolean
	label?: string
	maxlength?: number
	max?: number
	min?: number
	placeholder?: string
	readOnly?: boolean
	type?: 'text' | 'email' | 'number' | 'password'
	value: string | number
	onBlur?: (e: FormEvent<HTMLInputElement>) => void
	onClear?: (e: FormEvent<HTMLButtonElement>) => void
	onChange: (e: FormEvent<HTMLInputElement>) => void
	onFocus?: (e: FormEvent<HTMLInputElement>) => void
}

const Input: FC<InputProps> = ({
	disabled = false,
	error,
	hasClear,
	isBlocked = false,
	label,
	maxlength,
	max,
	min,
	placeholder,
	readOnly = false,
	type = 'text',
	value,
	onBlur,
	onClear,
	onChange,
	onFocus,
	...rest
}: InputProps) => {
	const [isFocus, setIsFocus] = useState<boolean>(false)
	const isPassword = type === 'password'
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)

	return (
		<Wrapper
			{...rest}
			isBlocked={isBlocked}
			disabled={disabled}
			hasError={Boolean(error)}
			hasLabel={Boolean(label)}
			isFocus={isFocus}>
			<InputWrapper
				disabled={disabled}
				maxLength={maxlength}
				max={max}
				min={min}
				placeholder={placeholder}
				type={isPassword && isPasswordVisible ? 'text' : type}
				readOnly={readOnly}
				value={value}
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
			/>
			{isPassword && (
				<Toggle onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}>
					{isPasswordVisible ? 'hide' : 'show'}
				</Toggle>
			)}
			{label && (
				<Label isActive={Boolean(`${value}`.trim()) || isFocus || Boolean(placeholder)}>
					{label}
				</Label>
			)}
			{hasClear && Boolean(value) && (
				<Clear onClick={onClear}>
					<CloseIcon />
				</Clear>
			)}
			<Error>{error}</Error>
		</Wrapper>
	)
}

const Wrapper = styled.div<{
	disabled: boolean
	isBlocked: boolean
	hasError: boolean
	hasLabel: boolean
	isFocus: boolean
}>`
	background: inherit;
	border-radius: 3px;
	border: 1px solid
		${(props) =>
			props.isFocus
				? props.hasError
					? props.theme.colors.danger
					: props.theme.colors.primary
				: props.hasError
				? props.theme.colors.danger
				: props.theme.colors.neutral002};
	display: flex;
	flex-direction: column-reverse;
	height: 50px;
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
	${(props) =>
		props.disabled &&
		css`
			opacity: 0.5;
		`}
`

const Toggle = styled.span`
	border-radius: ${(props) => props.theme.radius.round};
	cursor: pointer;
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 800;
	letter-spacing: 0.04em;
	padding: 0 8px;
	position: absolute;
	right: 5px;
	text-transform: uppercase;
	top: 13px;
	z-index: 2;
	&:hover {
		background: ${(props) => props.theme.colors.neutral005};
	}
`

const Label = styled.label<{ isActive: boolean }>`
	background: inherit;
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

const InputWrapper = styled.input`
	background: none;
	border-radius: ${(props) => props.theme.radius.small};
	color: ${(props) => props.theme.colors.neutral000};
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.medium};
	outline: none;
	z-index: 1;
`
const Error = styled.div`
	top: 35px;
	color: ${(props) => props.theme.colors.danger};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	right: 10px;
	letter-spacing: 0.02em;
	position: absolute;
`

const Clear = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	font-size: ${(props) => props.theme.font.sizes.normal};
	position: absolute;
	right: 10px;
	top: 13px;
	z-index: 10;
	&:hover {
		opacity: 0.75;
	}
`
export default Input
