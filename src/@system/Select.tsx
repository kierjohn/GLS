import { FC, FormEvent, ReactNode, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import { ReactComponent as DropDownIcon } from 'icons/chevronDown.svg'

export type SelectProps = {
	children: ReactNode
	error?: string
	isBlocked?: boolean
	label: string
	maxlength?: number
	placeholder?: string
	title?: string
	value: string | number | undefined
	onBlur?: (e: FormEvent<HTMLSelectElement>) => void
	onChange: (e: FormEvent<HTMLSelectElement>) => void
	onFocus?: (e: FormEvent<HTMLSelectElement>) => void
}

const Select: FC<SelectProps> = ({
	isBlocked = false,
	children,
	error,
	label,
	maxlength,
	placeholder,
	title = label,
	value = undefined,
	onBlur,
	onChange,
	onFocus,
	...rest
}: SelectProps) => {
	const [isFocus, setIsFocus] = useState<boolean>(false)
	const active = Boolean(`${value}`.trim()) || isFocus || Boolean(placeholder)
	return (
		<Wrapper
			{...rest}
			isBlocked={isBlocked}
			hasError={Boolean(error)}
			hasLabel={Boolean(label)}
			isFocus={isFocus}>
			<SelectIconWrapper>
				<SelectWrapper
					id={label.replace(' ', '')}
					aria-label={label}
					isActive={Boolean(value)}
					name={label}
					placeholder={placeholder}
					title={title}
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
					}}>
					<option value='' disabled>{`Select ${label}`}</option>
					{children}
				</SelectWrapper>
				<Icon>
					<DropDownIcon />
				</Icon>
			</SelectIconWrapper>
			{label && (
				<Label htmlFor={`${label.replace(' ', '')}`} isActive={active}>
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
`

const SelectIconWrapper = styled.div`
	align-items: center;
	display: flex;

	//TODO: implement dropdown icon on select
`

const Label = styled.label<{ isActive: boolean }>`
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

const SelectWrapper = styled.select<{ isActive: boolean }>`
	appearance: none;
	background: none;
	border-radius: ${(props) => props.theme.radius.small};
	color: ${(props) => (props.isActive ? props.theme.colors.neutral000 : 'transparent')};
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.medium};
	outline: none;
	z-index: 1;
	width: 100%;
	& > option {
		color: ${(props) => props.theme.colors.neutral000};
	}
`

const Icon = styled.div`
	position: absolute;
	z-index: 0;
	right: 20px;
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

export default Select
