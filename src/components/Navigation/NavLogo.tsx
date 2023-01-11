import { ReactComponent as Logo } from 'images/logo.svg'
import { ReactComponent as LogoDynamic } from 'images/logoDynamic.svg'
import { isNil } from 'lodash'
import { useMeState } from 'providers/Me'
import { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

export type NavLogoProps = {
	actions?: ReactNode
}

const NavLogo: FC<NavLogoProps> = ({ actions }) => {
	const user = useMeState()

	return (
		<Wrapper>
			<Nav>
				<LogoWrapper to='/'>
					{user.theme === 'dark' ? <LogoDynamic /> : <Logo />}
				</LogoWrapper>
				{!isNil(actions) && actions}
			</Nav>
		</Wrapper>
	)
}

const Wrapper = styled.section`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral006};
	display: flex;
	justify-content: center;
	transition: all 250ms cubic-bezier(1, 0, 0, 1);
	width: 100%;
	height: 60px;
	width: 100%;
	z-index: 1000;
`

const Nav = styled.nav`
	align-items: center;
	display: flex;
	max-width: 100%;
	width: 100%;
	z-index: 1000;
`

const LogoWrapper = styled(Link)`
	background: none;
	color: ${(props) => props.theme.colors.neutral000};
	display: flex;
	flex-direction: column;
	margin-right: auto;
	padding: 20px 20px;
	width: 130px;
	overflow: visible;

	& > svg {
		width: 130px;
	}
`

export default NavLogo
