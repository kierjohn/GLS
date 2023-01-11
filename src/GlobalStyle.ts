import { createGlobalStyle } from 'styled-components/macro'
import { ThemeType } from 'theme'

const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`
  * {
    background: inherit;
    border: 0;
    box-sizing: border-box;
    font-family: ${(props) => props.theme.font.family.default};
    margin: 0;
    @media screen and (min-width: 992px) {
      font-size: 16px;
    }
  }

  html,
  body {
    -webkit-font-smoothing: antialiased;
    background-color: ${(props) => props.theme.colors.neutral007};
    color: ${(props) => props.theme.colors.neutral000};
    font-family: ${(props) => props.theme.font.family.default};
    font-size: 100%;
    line-height: 1.7em;
    min-height: 100vh;
    scroll-behavior: smooth;
  }

  #root, .App {
    min-height: 100vh;
  }

  a {
    font-size: inherit;
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;

    &:hover {
      opacity: 0.75;
    }
  }

  p, li {
    color: ${(props) => props.theme.colors.neutral003};
    font-size: ${(props) => props.theme.font.sizes.medium};
  }
  
  hr {
    border-bottom: 1px solid ${(props) => props.theme.colors.neutral005};
  }
`

export default GlobalStyle
