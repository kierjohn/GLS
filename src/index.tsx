import { Canvg } from 'canvg'
import 'fonts/stylesheet.css'
import html2canvas from 'html2canvas'
import { MeProvider } from 'providers/Me'
import { ReportsProvider } from 'providers/Reports'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import 'reset.css'

import App from './App'

window.html2canvas = html2canvas
window.canvg = Canvg

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<MeProvider>
				<ReportsProvider>
					<App />
				</ReportsProvider>
			</MeProvider>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
)
