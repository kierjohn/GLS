import { filter } from 'lodash'
import { createContext, Dispatch, FC, ReactNode, useContext, useReducer } from 'react'

export enum ToastActions {
	add = 'ADD_TOAST',
	remove = 'REMOVE_TOAST'
}

export enum ToastTypes {
	info = 'INFO',
	danger = 'DANGER',
	warning = 'WARNING'
}

export type ToastContextMessageProps = {
	id: string
	text: string | ReactNode
	timer?: number
	type?: string | ToastTypes
}

export type ToastStateProps = {
	messages: Array<ToastContextMessageProps>
}

export type ToastActionProps =
	| { type: ToastActions.add; payload: ToastContextMessageProps }
	| { type: ToastActions.remove; payload: string }

export const initialToastState: ToastStateProps = {
	messages: []
}

export const ToastState = createContext<ToastStateProps>(initialToastState)
export const ToastDispatch = createContext<Dispatch<ToastActionProps>>(() => null)

export const useToastState = () => useContext(ToastState)
export const useToastDispatch = () => useContext(ToastDispatch)

export const ToastReducer = (state: ToastStateProps, action: ToastActionProps) => {
	switch (action.type) {
		case ToastActions.add:
			return {
				...state,
				messages: [
					...state.messages,
					{
						id: `${Date.now()}`,
						text: action.payload.text,
						timer: action.payload.timer ? action.payload.timer : 5000,
						type: action.payload.type ? action.payload.type : ''
					}
				]
			}
		case ToastActions.remove:
			return {
				...state,
				messages: filter(state.messages, (message) => message.id !== action.payload)
			}
	}
}

export const ToastProvider: FC = ({ children }) => {
	const [toastState, toastDispatch] = useReducer(
		ToastReducer,
		initialToastState,
		() => initialToastState
	)

	return (
		<ToastState.Provider value={toastState}>
			<ToastDispatch.Provider value={toastDispatch}>{children}</ToastDispatch.Provider>
		</ToastState.Provider>
	)
}
