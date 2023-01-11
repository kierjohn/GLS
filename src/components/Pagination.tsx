import SystemButton from '@system/Button'
import { ReactComponent as BackIcon } from 'icons/back.svg'
import { ReactComponent as ForwardIcon } from 'icons/forward.svg'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components/macro'

export type PaginationProps = {
	count: number
	limit: number
	page: number
	setPage: Dispatch<SetStateAction<number>>
}

const Pagination: FC<PaginationProps> = ({ count, limit, page, setPage }) => {
	const { t } = useTranslation('common')
	const updatePage = (pageNumber: number) => () => setPage(pageNumber)

	if (count < limit) {
		return <></>
	}
	return (
		<Wrapper>
			<Button disabled={page <= 1} onClick={updatePage(page - 1)} isPrev>
				<BackIcon /> {t('pagination.prev')}
			</Button>
			<WebOnly>
				{page > 2 && (
					<Button variant='ghost-light' onClick={updatePage(page - 2)}>
						{page - 2}
					</Button>
				)}
				{page > 1 && (
					<Button variant='ghost-light' onClick={updatePage(page - 1)}>
						{page - 1}
					</Button>
				)}
				<Button variant='ghost-light' isActive>
					{page}
				</Button>
				{count / limit > page && (
					<Button variant='ghost-light' onClick={updatePage(page + 1)}>
						{page + 1}
					</Button>
				)}

				{count / limit > page + 1 && (
					<Button variant='ghost-light' onClick={updatePage(page + 2)}>
						{page + 2}
					</Button>
				)}
				{count / limit > page + 2 && page <= 2 && (
					<Button variant='ghost-light' onClick={updatePage(page + 3)}>
						{page + 3}
					</Button>
				)}
				{count / limit > page + 3 && page === 1 && (
					<Button variant='ghost-light' onClick={updatePage(page + 4)}>
						{page + 4}
					</Button>
				)}
			</WebOnly>
			<Button disabled={count / limit <= page} isNext onClick={updatePage(page + 1)}>
				<ForwardIcon /> {t('pagination.next')}
			</Button>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	padding: 20px;
	@media screen and (min-width: 992px) {
		padding: 20px 40px;
	}
`

const Button = styled(SystemButton)<{
	isNext?: boolean
	isActive?: boolean
	isPrev?: boolean
}>`
	border-radius: ${(props) => props.theme.radius.small};
	height: 40px;
	width: 50px;
	align-items: center;
	display: flex;
	font-size: ${(props) => props.theme.font.sizes.normal};
	justify-content: center;
	letter-spacing: 0.04em;
	margin-left: 5px;
	padding: 10px 20px;

	${(props) =>
		props.isActive &&
		css`
			background-color: ${(props) => props.theme.colors.neutral003};
			color: ${(props) => props.theme.colors.neutral001};
		`}
	${(props) =>
		props.isPrev &&
		css`
			margin-left: 0;
			width: auto;
		`}
	${(props) =>
		props.isNext &&
		css`
			color: ${(props) => props.theme.colors.neutral001};
			width: auto;
			margin-left: auto;
		`}
`

const WebOnly = styled.div`
	display: none;

	@media screen and (min-width: 768px) {
		display: flex;
	}
`
export default Pagination
