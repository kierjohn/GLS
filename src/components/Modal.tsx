import Card from 'components/Card'
import { ReactComponent as CloseIcon } from 'icons/timesLarge.svg'
import { isNil } from 'lodash'
import { transparentize } from 'polished'
import { Dispatch, FC, SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components/macro'

export type ModalProps = {
	isVisible: boolean
	subtitle?: string
	title?: string
	onClose?: Dispatch<SetStateAction<boolean>> | ((e: boolean) => void)
}

const Modal: FC<ModalProps> = ({ children, isVisible, subtitle, title, onClose }) => {
	const hasHeader = Boolean(title)
	const portal = document.getElementById('modalPortal') as HTMLElement

	const ModalComponent = (() => {
		return (
			<Wrapper isVisible={isVisible}>
				<Backdrop
					onClick={() => !isNil(onClose) && onClose(false)}
					isVisible={isVisible}
				/>
				<ModalCard hasPadding={false} isVisible={isVisible}>
					{hasHeader && (
						<Header>
							<TitleWrapper>
								<Title>{title}</Title>
								<Subtitle>{subtitle}</Subtitle>
							</TitleWrapper>
							{!isNil(onClose) && (
								<Close onClick={() => onClose(false)}>
									<CloseIcon />
								</Close>
							)}
						</Header>
					)}
					<Body hasHeader={hasHeader}>{children}</Body>
				</ModalCard>
			</Wrapper>
		)
	})()

	return createPortal(ModalComponent, portal)
}

const Wrapper = styled.div<{ isVisible: boolean }>`
	align-items: flex-end;
	background: transparent;
	bottom: 0;
	display: flex;
	height: 100%;
	justify-content: center;
	left: 0;
	position: fixed;
	top: ${(props) => (props.isVisible ? '0' : '100%')};
	width: 100%;
	z-index: 10000;
	@media screen and (min-width: 992px) {
		align-items: center;
	}
`
const Backdrop = styled.div<{ isVisible: boolean }>`
	align-items: center;
	backdrop-filter: blur(5px);
	background: ${(props) => transparentize(0.85, props.theme.colors.neutral000)};
	display: flex;
	height: 100%;
	justify-content: center;
	opacity: ${(props) => (props.isVisible ? '1' : '0')};
	position: absolute;
	transition: opacity 250ms ease-in-out;
	width: 100%;
`

const ModalCard = styled(Card)<{ isVisible: boolean }>`
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	box-shadow: 0 20px 66px 0 rgba(34, 48, 73, 0.2);
	border: none;
	display: flex;
	flex-direction: column;
	margin-bottom: ${(props) => (props.isVisible ? 0 : '-50px')};
	max-height: 95%;
	opacity: ${(props) => (props.isVisible ? 1 : 0)};
	overflow: hidden;
	transition: margin-bottom 250ms ease-in-out, opacity 250ms ease-in-out;
	width: 480px;
	z-index: 10001;
	@media screen and (min-width: 992px) {
		border-bottom-left-radius: ${(props) => props.theme.radius.medium};
		border-bottom-right-radius: ${(props) => props.theme.radius.medium};
	}
`

const Header = styled.div`
	align-items: center;
	display: flex;
	padding: 15px 20px 20px 30px;
	height: 85px;
`

const TitleWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`

const Title = styled.span`
	font-size: ${(props) => props.theme.font.sizes.h4};
	font-weight: 800;
	line-height: 18px;
	margin-bottom: 5px;
`

const Subtitle = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 600;
	line-height: 16px;
	margin-right: auto;
`

const Close = styled.button`
	background: none;
	border-radius: ${(props) => props.theme.radius.medium};
	border: none;
	color: ${(props) => props.theme.colors.neutral000};
	cursor: pointer;
	height: 50px;
	width: 50px;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral005};
		opacity: 0.75;
	}
	&:active {
		opacity: 0.5;
	}
`
const Body = styled.div<{ hasHeader: boolean }>`
	padding: ${(props) => (props.hasHeader ? '10px' : '30px')} 30px 30px 30px;
	height: 100%;
	overflow: auto;
`

export default Modal
