import { ChecklistProps } from 'api/Checklist'
import { DateTime } from 'luxon'
import { AreaProps } from 'providers/Areas/types'
import { UserProps } from 'providers/Users/types'

export enum AuditActions {
	fetch = 'FETCH',
	fetchDetails = 'FETCH_DETAILS',
	updateLoading = 'UPDATE_LOADING',
	updateCount = 'UPDATE_COUNT'
}

export type AuditActionProps =
	| { type: AuditActions.fetch; payload: Array<AuditProps> }
	| { type: AuditActions.fetchDetails; payload: AuditProps }
	| { type: AuditActions.updateLoading; payload: boolean }
	| { type: AuditActions.updateCount; payload: number }

export type AuditScoreProps = {
	id: string
	categoryId: string
	categoryName: string
	categoryDescription: string
	comment?: string
	example?: string
	hasDeviation: boolean
	image?: string
	maxPoints: number
	order: number
	question: string
	score: number
}

export type AuditProps = {
	createdAt: DateTime
	createdBy: Partial<UserProps>
	checklist: Partial<ChecklistProps>
	id: string
	area?: Partial<AreaProps>
	status: number
	scores: Array<AuditScoreProps>
}

export type AuditsStateProps = {
	data: Array<AuditProps>
	details: AuditProps
	isLoading: boolean
	count: number
}
