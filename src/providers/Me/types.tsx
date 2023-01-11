import { UserProps } from 'providers/Users/types'

export enum MeActions {
	fetch = 'FETCH',
	reset = 'RESET',
	update = 'UPDATE',
	updateLoading = 'UPDATE_LOADING',
	updateLoggedInStatus = 'UPDATE_LOGGED_IN_STATUS'
}

export type MeActionProps =
	| { type: MeActions.fetch; payload: UserProps }
	| { type: MeActions.update; payload: UserProps }
	| { type: MeActions.reset }
	| { type: MeActions.updateLoading; payload: boolean }
	| { type: MeActions.updateLoggedInStatus; payload: boolean }
