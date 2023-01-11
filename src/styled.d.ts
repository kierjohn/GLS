import 'styled-components'

declare module 'styled-components' {
	export interface DefaultTheme {
		type: string
		colors: {
			[danger: string]: string
			[neutral000: string]: string
			[neutral001: string]: string
			[neutral002: string]: string
			[neutral003: string]: string
			[neutral004: string]: string
			[neutral005: string]: string
			[neutral006: string]: string
			[neutral007: string]: string
			[primary: string]: string
			[s1: string]: string
			[s2: string]: string
			[s3: string]: string
			[s4: string]: string
			[s5: string]: string
			[s6: string]: string
			[success: string]: string
			[warning: string]: string
		}
		font: {
			family: {
				default: string
				header: string
			}
			sizes: {
				h1: string
				h2: string
				h3: string
				h4: string
				h5: string
				h6: string
				large: string
				medium: string
				normal: string
				small: string
				tiny: string
			}
		}
		indexes: {
			navigation: string
		}
		radius: {
			large: string
			medium: string
			round: string
			small: string
		}
		shadows: {
			default: string
			light: string
			wide: string
		}
	}
}
