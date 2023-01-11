import styled from 'styled-components/macro'

export const Wrapper = styled.div`
	margin: 0 auto;
	max-width: 800px;
	padding: 20px;
	height: auto;

	& h2 {
		color: ${(props) => props.theme.colors.neutral002};
		margin-bottom: 30px;
		margin-top: 20px;
	}

	& h3 {
		color: ${(props) => props.theme.colors.neutral002};
		margin-bottom: 10px;
	}
	& h4 {
		color: ${(props) => props.theme.colors.neutral002};
	}

	& p {
		margin-bottom: 20px;
	}
`
