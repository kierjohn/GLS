import useScrollPosition from '@react-hook/window-scroll'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import NavigationMobile from './Mobile'
import MainNavigation from './MainNavigation'
import { useLocation } from 'react-router-dom'

export type NavigationProps = {
	isApp?: boolean
	isNavLogo?: boolean
}

const Navigation: FC<NavigationProps> = ({ isApp = false }) => {
	const { pathname } = useLocation()
	const scrollY = useScrollPosition()

	const [scrollPositionChange, setScrollPositionChange] = useState<boolean>(false)
	const [isOpen, setIsOpen] = useState<boolean>(false)

	useEffect(() => {
		setScrollPositionChange(true)
	}, [scrollY])

	useEffect(() => {
		setScrollPositionChange(false)
		window.scrollTo(0, 0)
	}, [pathname])

	return (
		<Wrapper isApp={isApp} isFixed={scrollPositionChange && scrollY >= 59}>
			<MainNavigation
				isFixed={scrollPositionChange && scrollY >= 59}
				isApp={isApp}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
			<NavigationMobile
				isFixed={scrollPositionChange && scrollY >= 59}
				isApp={isApp}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
		</Wrapper>
	)
}
const Wrapper = styled.section<{ isApp: boolean; isFixed: boolean }>`
	display: flex;
	margin-bottom: ${(props) => (props.isFixed ? '59px' : '0')};
	width: 100%;
	z-index: 100;
`

export default Navigation
