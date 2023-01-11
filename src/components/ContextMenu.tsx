import { map } from 'lodash'
import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components/macro'
import { ReactComponent as EllipsisIcon } from 'icons/ellipsis.svg'
import ClickOutside from './ClickOutside'
import Card from './Card'

export type ContextMenuItemProps = {
	icon?: ReactNode
	text: string
	onClick: (props?: any) => any
}

export type ContextMenuProps = {
	icon?: ReactNode
	items: Array<ContextMenuItemProps>
	value: any
}

const ContextMenu: FC<ContextMenuProps> = ({ value, items, icon }) => {
	const [isActive, setIsActive] = useState<boolean>(false)
	return (
		<Wrapper>
			<MenuToggle onClick={() => setIsActive((isActive) => !isActive)}>
				{icon ? icon : <EllipsisIcon />}
			</MenuToggle>
			{items && (
				<ClickOutside onClickOutside={() => setIsActive(false)}>
					<MenuItems isFloating hasPadding={false} isActive={isActive}>
						{map(items, (item, key) => (
							<MenuItem
								key={key}
								onClick={() => {
									item.onClick(value)
									setIsActive(false)
								}}>
								<MenuIcon>{item.icon && item.icon} </MenuIcon>
								<MenuText>{item.text}</MenuText>
							</MenuItem>
						))}
					</MenuItems>
				</ClickOutside>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
`

const MenuToggle = styled.button`
	background: none;
	border-radius: ${(props) => props.theme.radius.medium};
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	height: 50px;
	width: 50px;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral005};
	}
`

const MenuItems = styled(Card)<{ isActive: boolean }>`
	border: none;
	box-shadow: 0 20px 66px 0 rgba(34, 48, 73, 0.2);
	display: ${(props) => (props.isActive ? 'flex' : 'none')};
	flex-direction: column;
	padding: 20px 0;
	position: absolute;
	right: 0;
	z-index: 100;
`
const MenuItem = styled.button`
	align-items: center;
	background: none;
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	display: flex;
	height: 50px;
	margin: none;
	padding: 0 30px;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral005};
	}

	&:active {
		opacity: 0.5;
	}
`

const MenuIcon = styled.span`
	margin-right: 15px;
`

const MenuText = styled.span`
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 600;
	letter-spacing: 0.04em;
	margin-left: 10px;
	white-space: nowrap;
`

export default ContextMenu
