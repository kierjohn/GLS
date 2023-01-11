export enum UserActions {
	add = 'ADD',
	fetch = 'FETCH',
	remove = 'REMOVE',
	update = 'UPDATE',
	updateCount = 'UPDATE_COUNT',
	updateLoading = 'UPDATE_LOADING'
}

export type UserProps = {
	acceptCookies: boolean
	currentPassword?: string
	email: string
	firstname: string
	id: string
	isLoading?: boolean
	isLoggedIn?: boolean
	is6s: boolean
	language: string
	lastname: string
	newPassword?: string
	password?: string
	role: number
	status: string
	targetScore: number
	taskOrder: Array<string>
	tester: boolean
	theme: string
	username: string
	userToken: string
	userTokenExpires: Date
	verified: boolean
	createdAt: Date
	issues: boolean
}

export type UserActionProps =
	| { type: UserActions.add; payload: UserProps }
	| { type: UserActions.fetch; payload: Array<UserProps> }
	| { type: UserActions.remove; payload: string }
	| { type: UserActions.update; payload: UserProps }
	| { type: UserActions.updateLoading; payload: boolean }
	| { type: UserActions.updateCount; payload: number }

export type UsersStateProps = {
	data: Array<UserProps>
	isLoading: boolean
	count: number
}
