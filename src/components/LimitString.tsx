import { trim } from 'lodash'
import parse from 'html-react-parser'
import { FC, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled, { css } from 'styled-components/macro'

export type LimitStringProps = {
	isDesktopOnly?: boolean
	str: string
	limit: number
	limitHeight?: number
}

export const LimitString: FC<LimitStringProps> = ({
	isDesktopOnly,
	str,
	limit,
	limitHeight = 0
}) => {
	const [isVisible, setIsVisible] = useState<boolean>(false)
	const bigScreen = useMediaQuery({
		query: '(min-width: 992px)'
	})
	if (trim(str).length > limit && isDesktopOnly && bigScreen) {
		return (
			<Wrapper
				isVisible={isVisible}
				onMouseEnter={() => setIsVisible((value) => !value)}
				onMouseLeave={() => setIsVisible((value) => !value)}
				limitHeight={limitHeight}>
				{isVisible ? (
					<Marked>{parse(trim(str))}</Marked>
				) : (
					parse(`${trim(str).substring(0, limit)}...`)
				)}
			</Wrapper>
		)
	}

	return <>{trim(str)}</>
}

const Wrapper = styled.span<{ isVisible: boolean; limitHeight: number }>`
	font-size: inherit;
	${(props) =>
		props.isVisible &&
		css`
			display: block;
			height: ${props.limitHeight ? `${props.limitHeight}px` : 'auto'};
			overflow: visible;
		`}
`

const Marked = styled.span`
	font-size: inherit;
	z-index: 10;
	position: relative;
`
