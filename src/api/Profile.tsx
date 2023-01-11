import api from 'api'
import { CancelTokenSource } from 'axios'
import { isNil } from 'lodash'
import { UserProps } from 'providers/Users/types'
import { getHeaders } from 'utils/helpers'

export const getProfile = ({ source }: { source: CancelTokenSource }) => {
	return api.get('/user/profile/me', {
		cancelToken: source.token,
		headers: getHeaders()
	})
}

export const updateProfile = ({
	acceptCookies,
	currentPassword,
	email,
	firstname,
	is6s,
	language,
	lastname,
	newPassword,
	role,
	status,
	targetScore,
	taskOrder,
	theme,
	username,
	verified,
	issues
}: Partial<UserProps>) => {
	const config =
		!isNil(currentPassword) && !isNil(newPassword)
			? {
					accept_cookies: acceptCookies,
					current_password: currentPassword,
					email,
					first_name: firstname,
					is_6s: is6s,
					language,
					last_name: lastname,
					new_password: newPassword,
					role,
					status,
					issues,
					target_score: targetScore,
					task_order: taskOrder,
					theme,
					username,
					verified
			  }
			: {
					accept_cookies: acceptCookies,
					current_password: currentPassword,
					email,
					first_name: firstname,
					is_6s: is6s,
					language,
					last_name: lastname,
					role,
					status,
					issues,
					target_score: targetScore,
					task_order: taskOrder,
					theme,
					username,
					verified
			  }

	return api.put('/user/profile/update', {
		...config,
		headers: getHeaders()
	})
}
