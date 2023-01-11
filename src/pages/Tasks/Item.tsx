import { isNil } from 'lodash'
import { DateTime } from 'luxon'
import { darken } from 'polished'
import { TaskProps } from 'providers/Tasks/types'
import { FC, ReactNode, useState } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled, { css } from 'styled-components/macro'
import { getElapseTime, limitTextLength } from 'utils/helpers'

export type TaskItemProps = TaskProps & {
	index: number
	onClick?: (props: TaskProps) => void
	children?: ReactNode
	draggable?: boolean
}

const Item: FC<TaskItemProps> = ({
	archived,
	area,
	audit,
	createdAt,
	createdBy,
	description,
	dueDate,
	id,
	image,
	index,
	location,
	priority,
	status,
	taskStatus,
	title,
	onClick,
	draggable = true
}) => {
	const [isImageNotFound, setIsImageNotFound] = useState<boolean>(false)

	if (!draggable) {
		return (
			<Wrapper
				onClick={() => {
					!isNil(onClick) &&
						onClick({
							archived,
							audit,
							area,
							description,
							dueDate,
							id,
							image,
							location,
							priority,
							status,
							title,
							createdAt,
							createdBy,
							taskStatus
						})
				}}>
				{image && !isImageNotFound && (
					<Image
						onError={() => {
							setIsImageNotFound(true)
						}}
						src={`${process.env.REACT_APP_API_URL}/public/images/audit/${image}`}
					/>
				)}
				<Area>{area.title}</Area>
				<Title>
					{limitTextLength({
						text: title,
						limit: 45,
						hasEllipsis: true
					})}
				</Title>
				<Description>
					{limitTextLength({ text: description, limit: 90, hasEllipsis: true })}
				</Description>
				<Due>
					<Priority level={priority} title={priority}></Priority>
					<DueDate>{getElapseTime(DateTime.fromJSDate(dueDate))}</DueDate>
				</Due>
			</Wrapper>
		)
	}
	return (
		<Draggable index={index} draggableId={id}>
			{(provided) => (
				<Wrapper
					onClick={() => {
						!isNil(onClick) &&
							onClick({
								archived,
								audit,
								area,
								description,
								dueDate,
								id,
								image,
								location,
								priority,
								status,
								title,
								createdAt,
								createdBy,
								taskStatus
							})
					}}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}>
					{image && !isImageNotFound && (
						<Image
							onError={() => {
								setIsImageNotFound(true)
							}}
							src={`${process.env.REACT_APP_API_URL}/public/images/audit/${image}`}
						/>
					)}
					<Area>{area.title}</Area>
					<Title>
						{limitTextLength({
							text: title,
							limit: 45,
							hasEllipsis: true
						})}
					</Title>
					<Description>
						{limitTextLength({ text: description, limit: 90, hasEllipsis: true })}
					</Description>
					<Due>
						<Priority level={priority} title={priority}></Priority>
						<DueDate>{getElapseTime(DateTime.fromJSDate(dueDate))}</DueDate>
					</Due>
				</Wrapper>
			)}
		</Draggable>
	)
}

const Area = styled.h4`
	font-size: ${(props) => props.theme.font.sizes.tiny};
	font-weight: 800;
	letter-spacing: 0.125em;
	line-height: 1.2em;
	text-transform: uppercase;
	color: ${(props) => props.theme.colors.neutral003};
	padding: 15px 15px 0 15px;
`

const Title = styled.h4`
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 800;
	letter-spacing: 0.02em;
	line-height: 1.2em;
	padding: 0 15px 0 15px;
`

const Image = styled.img`
	width: 100%;
	height: 120px;
	object-fit: cover;
	margin-bottom: 10px;
`

const Description = styled.span`
	color: ${(props) => props.theme.colors.neutral002};
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 400;
	letter-spacing: 0.02em;
	line-height: 1.4em;
	padding: 0 15px 0 15px;
`

const Due = styled.div`
	color: ${(props) => props.theme.colors.neutral002};
	align-items: center;
	display: flex;
	letter-spacing: 0.02em;
	padding: 20px 15px;
	grid-gap: 10px;
`

const DueDate = styled.span`
	color: ${(props) => props.theme.colors.neutral002};
	font-size: ${(props) => props.theme.font.sizes.small};
	line-height: ${(props) => props.theme.font.sizes.medium};
	font-weight: 600;
	margin-right: auto;
`

const Priority = styled.div<{ level: string }>`
	align-items: center;
	color: ${(props) => props.theme.colors.neutral001};
	display: flex;
	height: 10px;
	width: 20px;
	${(props) => {
		switch (props.level.toLowerCase()) {
			case 'medium':
				return css`
					background: ${props.theme.colors.warning};
				`
			case 'high':
				return css`
					background: ${props.theme.colors.danger};
				`
			case 'urgent':
				return css`
					background: ${darken(0.35, props.theme.colors.danger)};
				`
			default:
				return css`
					background: ${props.theme.colors.success};
				`
		}
	}};
	border-radius: ${(props) => props.theme.radius.small};
`

const Wrapper = styled.div`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-radius: 10px;
	border: 1px solid ${(props) => props.theme.colors.neutral005};
	box-shadow: ${(props) => props.theme.shadows.default};
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;
	overflow: hidden;
	&:hover {
		opacity: 0.75;
	}
`

export default Item
