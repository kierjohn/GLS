import styled from 'styled-components/macro'

export const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	height: fit-content;
	margin: 0 auto;
	max-width: 600px;
	padding: 20px;
	position: relative;
	width: 100%;
	@media screen and (min-width: 992px) {
		margin: 0 auto;
		padding: 30px;
		width: 600px;
		height: 100%;
	}
`

export const Body = styled.div`
	flex: 1;
	padding: 0;
	width: 100%;
	@media screen and (min-width: 992px) {
		padding: 30px;
	}
	& > * {
		margin-bottom: 25px;
	}
`

export const Header = styled.div`
	padding: 20px 0 20px 0;
	@media screen and (min-width: 992px) {
		padding: 30px 30px 0 30px;
	}
`

export const Footer = styled.div`
	display: flex;
	flex-direction: column;
	@media screen and (min-width: 768px) {
		flex-direction: row;
		padding: 20px 0 20px 0;
	}

	@media screen and (min-width: 992px) {
		padding: 0 30px 30px 30px;
	}

	& > * {
		width: 100%;
		&:first-child {
			@media screen and (min-width: 768px) {
				width: auto;
				margin-left: auto;
			}
		}
	}
`
