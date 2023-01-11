import styled from 'styled-components/macro'
import { ReactComponent as ToggleIcon } from 'icons/times.svg'
import { FC } from 'react'

export type FaqItemProps = {
	id: string
	answer: string
	question: string
	isOpen: boolean
	setIsOpen: (isOpen: string) => void
}

const Item: FC<FaqItemProps> = ({ id, answer, question, isOpen, setIsOpen }) => {
	return (
		<Wrapper>
			<Header>
				<Question>{question}</Question>
				<Toggle onClick={() => (isOpen ? setIsOpen('') : setIsOpen(id))} isOpen={isOpen}>
					<ToggleIcon />
				</Toggle>
			</Header>
			<Answer isOpen={isOpen}>{answer}</Answer>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 20px;
	background-color: ${(props) => props.theme.colors.neutral001};
	padding: 30px;
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	box-shadow: ${(props) => props.theme.shadows.wide};
	border-radius: ${(props) => props.theme.radius.large};
	max-width: 600px;
	width: 100%;
`

const Question = styled.div`
	flex: 1;
	font-weight: 800;
	font-size: 20px;
`

const Answer = styled.div<{ isOpen: boolean }>`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 18px;
	font-weight: 400;
	height: ${(props) => (props.isOpen ? 'auto' : '0')};
	max-height: ${(props) => (props.isOpen ? '500px' : '0')};
	overflow: hidden;
	padding-top: ${(props) => (props.isOpen ? '20px' : '0')};
	transition: max-height 250ms ease-in-out;
`

const Header = styled.div`
	align-items: center;
	display: flex;
`

const Toggle = styled.button<{ isOpen: boolean }>`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral004};
	border-radius: 100%;
	display: flex;
	height: 25px;
	justify-content: center;
	width: 25px;
	transition: transform 250ms ease-in-out;
	transform: ${(props) => (!props.isOpen ? 'rotate(45deg)' : 'rotate(0deg)')};
`

export default Item
