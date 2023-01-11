import styled from 'styled-components/macro'
import Card from './Card'

export const MainWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: center;
`

export const Header = styled.div`
	padding: 30px 30px 0 30px;
	& > h3 {
		margin-bottom: 5px;
	}
	@media screen and (min-width: 375px) {
		padding: 30px 40px 0 40px;
		width: 375px;
	}
`

export const EntryCard = styled(Card)`
	background-color: ${(props) => props.theme.colors.neutral007};
	border: none;
	box-shadow: none;
	margin-bottom: 0;
	padding: 0;
	width: calc(100% - 2px);
	@media screen and (min-width: 375px) {
		background-color: ${(props) => props.theme.colors.neutral001};
		border: 1px solid ${(props) => props.theme.colors.neutral004};
		box-shadow: ${(props) => props.theme.shadows.wide};
		width: auto;
	}
`

export const FormWrapper = styled.div`
	padding: 30px;
	width: 100vw;
	@media screen and (min-width: 375px) {
		padding: 30px 40px;
		width: 375px;
	}
`

export const Form = styled.div`
	& > * {
		margin-bottom: 24px;
	}
`

export const Darken = styled.span`
	color: ${(props) => props.theme.colors.neutral000};
	white-space: nowrap;
`

export const OptionWrapper = styled.div`
	padding: 30px;
	width: 340px;
	& > * {
		margin-bottom: 10px;
	}
`

export const ButtonWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	padding: 20px;
	width: 100%;
`

export const ActionWrapper = styled.div`
	align-items: baseline;
	display: flex;
	white-space: nowrap;
	& > a {
		margin-left: 5px;
		font-weight: 700;
	}
`
