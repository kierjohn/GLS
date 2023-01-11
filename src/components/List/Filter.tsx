import React, { FC } from 'react'
import styled from 'styled-components/macro'
import { ReactComponent as CloseIcon } from 'icons/times.svg'

export type ListFilterProps = {
	type: string
	value: string
	onClose: () => void
}

const Filter: FC<ListFilterProps> = ({ type, value, onClose }) => {
	return (
		<Wrapper>
			<Label>{type}</Label> <Value>{value}</Value>
			<Close title='close'>
				<CloseIcon />
			</Close>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral006};
	border-radius: 40px;
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	cursor: default;
	display: flex;
	height: 40px;
	margin: 0 10px;
	padding: 10px;
	user-select: none;

	&:hover {
		opacity: 0.75;
	}
`

const Label = styled.span`
	color: ${(props) => props.theme.colors.neutral000};
	font-weight: 800;
	margin-right: 10px;
`

const Value = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-weight: 800;
	margin-right: 10px;
`

const Close = styled.button`
	background: none;
	border: none;
	color: ${(props) => props.theme.colors.neutral003};
	cursor: pointer;
	&:hover {
		opacity: 0.75;
	}
`

export default Filter
