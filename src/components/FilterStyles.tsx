import styled from 'styled-components/macro'

export const Wrapper = styled.div`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-left: 1px solid ${(props) => props.theme.colors.neutral006};
	border-right: 1px solid ${(props) => props.theme.colors.neutral006};
	display: flex;
	flex-direction: column;
	height: 100vh;
	left: -300px;
	overflow: auto;
	padding: 30px;
	position: fixed;
	width: 300px;
	z-index: 0;
	@media screen and (min-width: 992px) {
		left: auto;
		top: 0;
		z-index: 10;
		padding-top: 90px;
	}
`

export const SearchWrapper = styled.div`
	display: flex;
	margin-bottom: 10px;
	width: 100%;
`

export const FilterWrapper = styled.div<{ isWrap?: boolean }>`
	display: flex;
	flex-direction: ${(props) => (props.isWrap ? 'row' : 'column')};
	align-items: ${(props) => (props.isWrap ? 'center' : 'stretch')};
	padding: ${(props) => (props.isWrap ? '20px' : '0')};
	margin-bottom: ${(props) => (props.isWrap ? '0' : '30px')};
`

export const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 800;
	letter-spacing: 0.04em;
	margin-bottom: 5px;
	margin-right: 10px;
`

export const CheckboxWrapper = styled.div`
	padding: 10px 5px;
`
