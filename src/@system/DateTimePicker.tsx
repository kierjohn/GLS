import { FC, FormEvent, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { isNil } from 'lodash'

export type DatePickerProps = {
	error?: string
	isBlocked?: boolean
	label?: string
	placeholder?: string
	value: Date
	onBlur?: (e: FormEvent<HTMLInputElement>) => void
	onChange: (date: Date) => void
	onFocus?: (e: FormEvent<HTMLInputElement>) => void
}

const DateTimePicker: FC<DatePickerProps> = ({
	error,
	isBlocked = false,
	label,
	placeholder,
	value,
	onBlur,
	onChange,
	onFocus,
	...rest
}: DatePickerProps) => {
	const [isFocus, setIsFocus] = useState<boolean>(false)

	return (
		<Wrapper
			{...rest}
			isBlocked={isBlocked}
			hasError={Boolean(error)}
			hasLabel={Boolean(label)}
			isFocus={isFocus}>
			<InputWrapper
				dateFormat='yyyy.MM.dd'
				selected={value}
				onChange={(date: Date) => {
					setIsFocus(false)
					onChange(date)
				}}
				onBlur={(e) => {
					setIsFocus(false)
					onBlur && onBlur(e)
				}}
				onFocus={(e) => {
					setIsFocus(true)
					onFocus && onFocus(e)
				}}
			/>
			{label && (
				<Label isActive={!isNil(value) || isFocus || Boolean(placeholder)}>{label}</Label>
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
	background: none;
	border-radius: ${(props) => props.theme.radius.small};
	border: 1px solid
		${(props) =>
			props.isFocus
				? props.hasError
					? props.theme.colors.danger
					: props.theme.colors.primary
				: props.hasError
				? props.theme.colors.danger
				: props.theme.colors.neutral002};
	box-shadow: none;
	display: flex;
	flex-direction: column-reverse;
	height: 50px;
	padding: 11px 15px;
	position: relative;
	text-align: left;
	transition: all 250ms ease-in-out;
	width: ${(props) => (props.isBlocked ? '100%' : 'auto')};

	& .react-datepicker-popper {
		z-index: 100;
	}

	& .react-datepicker {
		background: ${(props) => props.theme.colors.neutral001};
		border-radius: ${(props) => props.theme.radius.medium};
		border: none;
		box-shadow: 0 20px 66px 0 rgba(34, 48, 73, 0.2);
		color: ${(props) => props.theme.colors.neutral001};
		font-family: ${(props) => props.theme.font.family.default};
		padding: 20px;
	}

	& .react-datepicker__triangle {
		display: none;
	}

	& .react-datepicker__header {
		background: none;
		border-bottom: 0;
		border-top-left-radius: ${(props) => props.theme.radius.medium};
		border-top-right-radius: ${(props) => props.theme.radius.medium};
	}

	& .react-datepicker__navigation {
		top: 20px;
		&-icon {
			&::before {
				border-color: ${(props) => props.theme.colors.neutral003};
				border-width: 2px 2px 0 0;
			}
			&:hover {
				&::before {
					border-color: ${(props) => props.theme.colors.primary};
				}
			}
		}

		&--previous {
			left: 20px;
		}
		&--next {
			right: 20px;
		}
	}

	& .react-datepicker__current-month {
		color: ${(props) => props.theme.colors.neutral000};
		font-size: ${(props) => props.theme.font.sizes.h5};
		font-weight: 800;
		letter-spacing: 0.04em;
		padding: 0 20px 20px 20px;
		text-transform: uppercase;
	}

	& .react-datepicker__day-names {
		display: flex;
	}

	& .react-datepicker__day-name {
		align-items: center;
		color: ${(props) => props.theme.colors.neutral000};
		display: flex;
		flex: 1;
		font-size: ${(props) => props.theme.font.sizes.h5};
		font-weight: 800;
		justify-content: center;
		letter-spacing: 0.04em;
		text-transform: uppercase;

		width: 40px;
		height: 40px;
	}

	& .react-datepicker__week {
		display: flex;
	}

	& .react-datepicker__day {
		align-items: center;
		justify-content: center;
		display: flex;
		border: 1px solid ${(props) => props.theme.colors.neutral001};
		border-radius: ${(props) => props.theme.radius.small};
		color: ${(props) => props.theme.colors.neutral003};
		flex: 1;
		font-size: ${(props) => props.theme.font.sizes.normal};
		font-weight: 700;
		width: 40px;
		height: 40px;
		&--outside-month {
			color: ${(props) => props.theme.colors.neutral003};
		}
		&--keyboard-selected {
			background: transparent;
			border: 1px solid ${(props) => props.theme.colors.primary};
			color: ${(props) => props.theme.colors.primary};
			outline: none;
		}

		&:hover {
			background: ${(props) => props.theme.colors.neutral003};
			border-radius: ${(props) => props.theme.radius.small};
			color: ${(props) => props.theme.colors.neutral001};
		}

		&--selected {
			color: ${(props) => props.theme.colors.neutral001};
		}
	}

	& .react-datepicker__month {
		margin: 0;
		&-container {
			width: 320px;
		}
	}
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

const InputWrapper = styled(DatePicker)`
	background: none;
	border-radius: ${(props) => props.theme.radius.small};
	color: ${(props) => props.theme.colors.neutral000};
	font-family: ${(props) => props.theme.font.family.default};
	font-size: ${(props) => props.theme.font.sizes.medium};
	outline: none;
	z-index: 1;
	width: 100%;
`
const Error = styled.div`
	bottom: -15px;
	color: ${(props) => props.theme.colors.danger};
	font-size: ${(props) => props.theme.font.sizes.small};
	font-weight: 600;
	left: 0;
	letter-spacing: 0.02em;
	position: absolute;
`
export default DateTimePicker
