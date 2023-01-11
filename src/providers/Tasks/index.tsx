import { createContext, Dispatch, FC, useContext, useReducer } from 'react'
import reducer from './reducer'
import { TaskActionProps, TasksStateProps } from './types'

export const initialState: TasksStateProps = {
	data: [],
	isLoading: true
}

export const TasksState = createContext<TasksStateProps>(initialState)
export const TasksDispatch = createContext<Dispatch<TaskActionProps>>(() => null)
export const useTasksState = () => useContext(TasksState)
export const useTasksDispatch = () => useContext(TasksDispatch)

export const TasksProvider: FC = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState, () => initialState)

	return (
		<TasksState.Provider value={state}>
			<TasksDispatch.Provider value={dispatch}>{children}</TasksDispatch.Provider>
		</TasksState.Provider>
	)
}
