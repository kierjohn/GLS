import { ContextMenuItemProps } from 'components/ContextMenu'
import { filter, map, size, uniq } from 'lodash'
import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import GhostLoader from './GhostLoader'
import ListItem from './Item'

export type ListProps = {
	action?: ReactNode
	data: any
	emptyStateAction?: ReactNode
	emptyStatetext?: string | ReactNode
	ghostLoading?: {
		dataCount: number
		itemCount: number
	}
	groupBy?: string
	hasPadding?: boolean
	hasMargin?: boolean
	isLoading: boolean
	isSmall?: boolean
	menu?: Array<ContextMenuItemProps>
	title?: string
	itemFormat: (props: any) => ReactNode
	onListItemClick?: (props?: any) => any
}

const List: FC<ListProps> = ({
	action,
	data,
	emptyStateAction,
	emptyStatetext,
	ghostLoading,
	groupBy = '',
	hasPadding = true,
	hasMargin = true,
	isLoading,
	isSmall = false,
	menu,
	title,
	itemFormat,
	onListItemClick
}) => {
	const { t } = useTranslation('common')
	const groups = Boolean(groupBy) ? uniq(map(data, (value) => value[groupBy])) : []

	return (
		<Wrapper hasPadding={hasPadding}>
			{title && (
				<Header>
					<Title>{title}</Title>
					{!isLoading && <ActionWrapper>{action}</ActionWrapper>}
				</Header>
			)}
			{isLoading && (
				<Body>
					<Group>
						<>
							{ghostLoading && (
								<GhostLoader
									isSmall={isSmall}
									dataCount={ghostLoading?.dataCount}
									itemCount={ghostLoading?.itemCount}
									min={100}
									max={200}
								/>
							)}
						</>
					</Group>
				</Body>
			)}

			{!isLoading && Boolean(size(data)) && (
				<Body>
					{Boolean(groups.length) ? (
						map(groups, (group, key) => (
							<Group key={key}>
								<GroupTitle> {group}</GroupTitle>
								{map(
									filter(data, (item) => item[groupBy] === group),
									(value) => (
										<ListItem
											hasMargin={hasMargin}
											isSmall={isSmall}
											itemData={itemFormat}
											key={value.id}
											menuItems={menu}
											onClick={onListItemClick}
											value={value}
										/>
									)
								)}
							</Group>
						))
					) : (
						<Group>
							{map(data, (value) => (
								<ListItem
									hasMargin={hasMargin}
									isSmall={isSmall}
									key={value.id}
									value={value}
									itemData={itemFormat}
									menuItems={menu}
									onClick={onListItemClick}
								/>
							))}
						</Group>
					)}
				</Body>
			)}
			{!isLoading && !Boolean(size(data)) && (
				<EmptyStateWrapper>
					<EmptyStateText>
						{emptyStatetext ? emptyStatetext : t('list.emptyStateDefaultText')}
					</EmptyStateText>
					<ActionWrapper>{emptyStateAction}</ActionWrapper>
				</EmptyStateWrapper>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div<{ hasPadding: boolean }>`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: ${(props) => (props.hasPadding ? '20px' : '0')};
	width: 100%;
	height: fit-content;
`

const Header = styled.div`
	align-items: center;
	display: flex;
	height: 100px;
	padding: 20px 0;
	width: 100%;

	@media screen and (min-width: 992px) {
		padding: 20px;
	}
`

const Title = styled.h2`
	font-size: ${(props) => props.theme.font.sizes.h4};
	margin-right: auto;
`

const ActionWrapper = styled.div`
	display: flex;
`

const Body = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	width: 100%;
`

const Group = styled.div`
	margin-bottom: 20px;
	&:last-child {
		margin-bottom: 0;
	}
	@media screen and (min-width: 992px) {
		margin-bottom: 40px;
	}
`

const GroupTitle = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 800;
	padding: 20px 10px 20px 20px;

	@media screen and (min-width: 992px) {
		border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
	}
`

export const EmptyStateWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: center;
	padding: 20px;
	min-height: 400px;
	width: 100%;
	height: 100%;
	@media screen and (min-width: 992px) {
		padding: 30px;
	}
`

export const EmptyStateText = styled.span`
	align-items: center;
	color: ${(props) => props.theme.colors.neutral003};
	display: flex;
	flex-direction: column;
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 600;
	justify-content: center;
	margin-bottom: 40px;
	text-align: center;
`

export default List
