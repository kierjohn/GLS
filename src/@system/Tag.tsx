import { FC, ReactNode } from 'react'
import styled from 'styled-components/macro'

export type TagProps = {
	description?: string | ReactNode
	hideDescription?: boolean
	label?: string
	value: boolean
	onCheck: () => void
}

const Tag: FC<TagProps> = ({
	description,
	hideDescription = false,
	label,
	value,
	onCheck,
	...rest
}) => {
	return (
		<Wrapper isChecked={value} onClick={() => onCheck()} {...rest}>
			<TextWrapper>{label ? <Label isChecked={value}>{label}</Label> : ''}</TextWrapper>
		</Wrapper>
	)
}

const TextWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

const Label = styled.label<{ isChecked: boolean }>`
	color: ${(props) =>
		props.isChecked ? props.theme.colors.neutral000 : props.theme.colors.neutral003};
	cursor: pointer;
	font-size: ${(props) => props.theme.font.sizes.h5};
	font-weight: 600;
	letter-spacing: 0.02em;
`

const Wrapper = styled.div<{ isChecked: boolean }>`
	align-items: center;
	cursor: pointer;
	display: flex;
	user-select: none;
	padding: 5px 20px;
	background: ${(props) => props.theme.colors.neutral001};
	border: 1px solid
		${(props) =>
			props.isChecked ? props.theme.colors.neutral003 : props.theme.colors.neutral005};
	border-radius: 50px;
	&:hover {
		${Label} {
			color: ${(props) => props.theme.colors.neutral002};
		}
	}
`

export default Tag
