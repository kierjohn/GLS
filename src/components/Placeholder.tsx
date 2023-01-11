import React, { FC } from 'react'
import styled from 'styled-components/macro'

const Placeholder: FC = ({ children }) => {
	return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.div`
	align-items: center;
	color: ${(props) => props.theme.colors.neutral003};
	display: flex;
	flex: 1;
	font-size: ${props => props.theme.font.sizes.h4};
	font-weight: 800;
	height: 100%;
	justify-content: center;
	min-height: 400px;
	width: 100%;
`

export default Placeholder
