import { useEffect } from 'react'
import DeviceDetector from 'device-detector-js'

const AppLink = () => {
	const deviceDetector = new DeviceDetector()
	const userAgent = deviceDetector.parse(navigator.userAgent)

	useEffect(() => {
		const APP_STORE = 'https://apps.apple.com/ph/app/goleansigma-6s-audit/id1635431415'
		const PLAY_STORE =
			'https://play.google.com/store/apps/details?id=com.goleansigma.audit'

		const userOS = String(userAgent?.os?.name).toLowerCase()

		switch (userOS) {
			case 'ios':
			case 'mac':
				window.location.replace(APP_STORE)
				break

			case 'android':
			case 'windows':
				window.location.replace(PLAY_STORE)
				break
			default:
				window.location.replace(PLAY_STORE)
		}
	}, [userAgent?.os?.name])
	return <></>
}

export default AppLink
