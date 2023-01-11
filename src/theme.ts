export type ThemeType = typeof themes.light

const t = {
	font: {
		family: {
			default: '"Dm Sans", sans-serif',
			header: '"Inter", Manrope, sans-serif'
		},
		sizes: {
			h1: '2.71em',
			h2: '2.29em',
			h3: '1.71em',
			h4: '1.29em',
			h5: '1em',
			h6: '0.71em',
			large: '1.43em',
			medium: '1.14em',
			normal: '16px',
			small: '0.86em',
			tiny: '0.71em'
		}
	},
	indexes: {
		navigation: '300'
	},
	radius: {
		large: '20px',
		medium: '10px',
		round: '100px',
		small: '5px'
	}
}

const themes: any = {
	light: {
		type: 'LIGHT',
		colors: {
			danger: '#E25858',
			neutral000: '#031723',
			neutral001: '#ffffff',
			neutral002: '#2D3133',
			neutral003: '#8096A3',
			neutral004: '#DBE2E5',
			neutral005: '#EFF3F5',
			neutral006: '#ebf1f4',
			neutral007: '#FAFDFF',
			primary: '#0B69AF',
			s1: '#F7B94D',
			s2: '#90EB5B',
			s3: '#6CD6E5',
			s4: '#8892E7',
			s5: '#D39EDB',
			s6: '#E67A81',
			success: '#22C489',
			warning: '#FF9838'
		},
		shadows: {
			default: '0px 5px 10px rgb(71, 82, 93, 0.05)',
			light: '0px 3px 10px rgba(71, 82, 93, 0.08)',
			wide: '0px 10px 20px rgba(71, 82, 93, 0.125)'
		},
		...t
	},
	dark: {
		type: 'DARK',
		colors: {
			danger: '#E25858',
			neutral000: '#e6ecf1',
			neutral001: '#000d12',
			neutral002: '#e7f5fb',
			neutral003: '#a6bfc9',
			neutral004: '#093447',
			neutral005: '#06222f',
			neutral006: '#031117',
			neutral007: '#00080b',
			primary: '#12A3D6',
			s1: '#f7b94d',
			s2: '#90EB5B',
			s3: '#6CD6E5',
			s4: '#8892E7',
			s5: '#D39EDB',
			s6: '#E67A81',
			success: '#22C489',
			warning: '#FF9838'
		},
		shadows: {
			default: '0px 5px 10px rgb(0, 0, 0, 0.5)',
			light: '0px 3px 10px rgba(0, 0, 0, 0.7)',
			wide: '0px 10px 20px rgba(0, 0, 0, 0.9)'
		},
		...t
	}
}

const theme = (theme: string) => themes[theme]
export default theme
