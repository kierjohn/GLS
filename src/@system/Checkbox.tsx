import React, { FC, ReactNode } from 'react'
import styled from 'styled-components/macro'
import { ReactComponent as CheckIcon } from 'icons/check.svg'

export type CheckboxProps = {
	description?: string | ReactNode
	hideDescription?: boolean
	label?: string
	value: boolean
	onCheck: () => void
}

const Checkbox: FC<CheckboxProps> = ({
	description,
	hideDescription = false,
	label,
	value,
	onCheck,
	...rest
}) => {
	const desc = typeof description === 'string' ? description.trim() : description
	return (
		<Wrapper
			hasDescription={Boolean(desc) && !hideDescription}
			onClick={() => onCheck()}
			{...rest}>
			<Checkmark isChecked={value}>{value && <CheckIcon />}</Checkmark>
			<TextWrapper>
				{label ? (
					<Label hasDescription={Boolean(desc) && !hideDescription} isChecked={value}>
						{label}
					</Label>
				) : (
					''
				)}
				{description && !hideDescription && <Description>{description}</Description>}
			</TextWrapper>
		</Wrapper>
	)
}

const Checkmark = styled.div<{ isChecked: boolean }>`
	align-items: center;
	background-color: ${(props) =>
		props.isChecked ? props.theme.colors.neutral000 : 'transparent'};
	border-radius: ${(props) => props.theme.radius.small};
	border: 1px solid
		${(props) =>
			props.isChecked ? props.theme.colors.neutral000 : props.theme.colors.neutral000};
	color: ${(props) =>
		props.isChecked ? props.theme.colors.neutral001 : props.theme.colors.neutral004};
	cursor: pointer;
	display: flex;
	height: 20px;
	justify-content: center;
	margin-right: 10px;
	width: 20px;
	& > svg {
		height: 10px;
	}
`

const TextWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

const Label = styled.label<{ hasDescription: boolean; isChecked: boolean }>`
	color: ${(props) =>
		props.isChecked ? props.theme.colors.neutral000 : props.theme.colors.neutral003};
	cursor: pointer;
	font-size: ${(props) => props.theme.font.sizes.h5};
	font-weight: 600;
	letter-spacing: 0.02em;
	margin-bottom: ${(props) => (props.hasDescription ? '5px' : '0px')};
`

const Description = styled.div`
	color: ${(props) => props.theme.colors.neutral002};
	font-size: ${(props) => props.theme.font.sizes.normal};
	line-height: 1.5em;
`

const Wrapper = styled.div<{ hasDescription: boolean }>`
	align-items: ${(props) => (props.hasDescription ? 'flex-start' : 'center')};
	cursor: pointer;
	display: flex;
	user-select: none;
	&:hover {
		${Checkmark} {
			opacity: 0.8;
		}

		${Label} {
			color: ${(props) => props.theme.colors.neutral002};
		}
	}
`

export default Checkbox
