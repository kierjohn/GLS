import ContextMenu, { ContextMenuItemProps } from 'components/ContextMenu'
import React, { FC, memo, ReactNode } from 'react'
import styled from 'styled-components/macro'

export type ListItemProps = {
	hasMargin: boolean
	isSmall: boolean
	itemData: (props: any) => ReactNode
	menuItems?: Array<ContextMenuItemProps>
	value: any
	onClick?: (props?: any) => any
}

const ListItem: FC<ListItemProps> = memo(
	({ hasMargin = true, isSmall, itemData, menuItems, value, onClick }) => {
		return (
			<Wrapper hasMargin={hasMargin} isSmall={isSmall}>
				<ItemWrapper onClick={() => onClick && onClick(value)}>
					{itemData(value)}
				</ItemWrapper>
				{menuItems && <ContextMenu value={value} items={menuItems} />}
			</Wrapper>
		)
	}
)

export const Wrapper = styled.div<{ hasMargin?: boolean; isSmall: boolean }>`
	border: none;
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	display: flex;
	margin-bottom: 10px;
	max-width: 100%;
	padding: 15px 10px 15px 15px;
	@media screen and (min-width: 992px) {
		margin-left: ${(props) => (props.hasMargin ? '20px' : '0')};
		margin-right: ${(props) => (props.hasMargin ? '20px' : '0')};
		padding: ${(props) => (props.isSmall ? '10px 10px 10px 0' : '15px 10px 15px 0')};
		width: auto;
		&:first-child {
			border-top: 1px solid ${(props) => props.theme.colors.neutral005};
		}
		&:last-child {
			border: none;
		}
	}
	&:hover {
		& > *:not(:last-child),
		& > *:first-child {
			opacity: 0.5;
		}
	}
`

export const ItemWrapper = styled.div<{ isSingle?: boolean }>`
	align-items: center;
	cursor: pointer;
	display: flex;
	flex: 1;
	width: 100%;
	position: relative;
	& > *:not(:first-child) {
		@media screen and (min-width: 992px) {
			display: flex;
		}
	}
`

export default ListItem
