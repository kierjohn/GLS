import { filter, groupBy, map, reduce, round } from 'lodash'
import { DateTime } from 'luxon'
import { DasboardReportDataProps } from 'pages/Dashboard/Reports'
import { ActivityProps } from 'providers/Activities/types'
import { AreaProps } from 'providers/Areas/types'
import { AuditProps, AuditScoreProps } from 'providers/Audits/types'
import { LocationProps } from 'providers/Locations/types'
import { TaskProps } from 'providers/Tasks/types'
import { UserProps } from 'providers/Users/types'

import { ReactComponent as TodoIcon } from 'icons/todo.svg'
import { ReactComponent as InProgressIcon } from 'icons/inProgress.svg'
import { ReactComponent as ToReviewIcon } from 'icons/toReview.svg'
import { ReactComponent as DoneIcon } from 'icons/done.svg'

export const getHeaders = () => {
	const token = localStorage.getItem('token') as string
	return {
		'Accept': 'application/json, text/plain, */*',
		'Content-Type': 'application/json',
		'x-access-token': token
	}
}

export const randomRange = (min: number, max: number) => {
	return Math.round(Math.random() * (max - min) + min)
}

export const getElapseTime = (date: DateTime): string => {
	const dateDiff = DateTime.now().diff(date, [
		'years',
		'months',
		'weeks',
		'days',
		'hours',
		'minutes'
	])

	//years
	if (Math.abs(dateDiff.years)) {
		if (dateDiff.years < 0) {
			return `Due in ${Math.abs(round(dateDiff.years))} year${
				dateDiff.years > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.years)} year${dateDiff.years > 1 ? 's' : ''} ago`
	}

	//months
	else if (Math.abs(dateDiff.months)) {
		if (dateDiff.months < 0) {
			return `Due in ${Math.abs(round(dateDiff.months))} month${
				dateDiff.months > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.months)} month${dateDiff.months > 1 ? 's' : ''} ago`
	}

	//weeks
	else if (Math.abs(dateDiff.weeks)) {
		if (dateDiff.weeks < 0) {
			return `Due in ${Math.abs(round(dateDiff.weeks))} week${
				dateDiff.weeks > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.weeks)} week${dateDiff.weeks > 1 ? 's' : ''} ago`
	}

	//days
	else if (Math.abs(dateDiff.days)) {
		if (dateDiff.days < 0) {
			return `Due in ${Math.abs(round(dateDiff.days))} day${dateDiff.days > 1 ? 's' : ''}`
		}
		return `${round(dateDiff.days)} day${dateDiff.days > 1 ? 's' : ''} ago`
	} else if (Math.abs(dateDiff.hours)) {
		if (dateDiff.hours < 0) {
			return `Due in ${Math.abs(round(dateDiff.hours))} hour${
				dateDiff.hours > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.hours)} hour${dateDiff.hours > 1 ? 's' : ''} ago`
	}

	//minutes
	else if (Math.abs(dateDiff.minutes)) {
		if (dateDiff.minutes < 0) {
			return `Due in ${Math.abs(round(dateDiff.minutes))} minute${
				dateDiff.minutes > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.minutes)} minute${dateDiff.minutes > 1 ? 's' : ''} ago`
	}

	//seconds
	else if (Math.abs(dateDiff.seconds)) {
		if (dateDiff.seconds < 0) {
			return `Due in ${Math.abs(round(dateDiff.seconds))} second${
				dateDiff.seconds > 1 ? 's' : ''
			}`
		}
		return `${round(dateDiff.seconds)} second${dateDiff.seconds > 1 ? 's' : ''} ago`
	} else {
		return ''
	}
}

export type LimitTextLengthProps = {
	text: string
	limit: number
	hasEllipsis?: boolean
}

export const limitTextLength = ({
	text,
	limit,
	hasEllipsis = false
}: LimitTextLengthProps) => {
	if (text.length > limit) {
		return `${text.substring(0, limit)}${hasEllipsis && '...'}`
	}

	return text
}

export const formatAreas = (data: any): Array<AreaProps> => {
	return map(data, (value) => {
		const formattedLocations: AreaProps = {
			createdAt: value?.createdAt,
			description: value?.description,
			id: value?._id,
			image: value?.image,
			status: value?.status,
			title: value?.title,
			type: value?.type,
			createdBy: {
				id: value?.created_by?._id,
				email: value?.created_by?.email
			},
			location: {
				id: value?.location?._id,
				name: value.location?.name,
				description: value?.location?.description,
				status: value?.location?.status
			}
		}

		return formattedLocations
	})
}

export const formatLocations = (data: any): Array<LocationProps> => {
	return map(data, (value) => {
		const formattedLocations: LocationProps = {
			createdAt: value?.createdAt,
			createdBy: {
				id: value?.created_by?._id,
				email: value?.created_by?.email
			},
			description: value?.description,
			id: value?._id,
			name: value?.name,
			status: value?.status
		}

		return formattedLocations
	})
}

export const formatActivities = (data: any): Array<ActivityProps> => {
	return map(data, (value) => {
		const formattedActivities: ActivityProps = {
			createdAt: value?.createdAt,
			createdBy: {
				id: value?.created_by?._id,
				email: value?.created_by?.email
			},
			description: value?.description,
			id: value?._id,
			title: value?.title,
			type: value?.type
		}

		return formattedActivities
	})
}

export const formatTasks = (data: any): Array<TaskProps> => {
	return map(data, (value) => {
		const formattedTask: TaskProps = {
			archived: value?.archived,
			audit: value?.audit,
			createdAt: new Date(value?.createdAt),
			createdBy: {
				id: value?.created_by?._id,
				email: value?.created_by?.email
			},
			description: value?.description,
			dueDate: new Date(value.due_date),
			id: value?._id,
			image: value?.image,
			location: {
				id: value?.location?._id,
				name: value?.location?.name
			},
			priority: value?.priority,
			status: value.status,
			taskStatus: value?.task_status,
			title: value?.task,
			area: {
				id: value?.area?._id,
				title: value?.area?.title
			}
		}

		return formattedTask
	})
}

export const formatUser = (data: any): UserProps => {
	return {
		acceptCookies: data.accept_cookies,
		email: data.email,
		firstname: data.first_name,
		id: data.id ? data.id : data._id,
		isLoading: false,
		isLoggedIn: data.isLoggedIn,
		is6s: data.is_6s,
		lastname: data.last_name,
		language: data.language,
		role: data.role,
		status: data.status,
		targetScore: data.target_score ? data.target_score : 75,
		taskOrder: data.task_order ? data.task_order : [],
		tester: data.tester,
		theme: data.theme,
		username: data.username,
		verified: data.verified,
		createdAt: new Date(data.createdAt),
		issues: data.issues,
		userToken: data.userToken,
		userTokenExpires: new Date(data.userTokenExpires)
	}
}

export const formatUsers = (data: any): Array<UserProps> => {
	return map(data, (value) => {
		return formatUser(value)
	})
}

export const formatAuditScore = (data: any) => {
	return map(data, (value) => {
		const formattedAuditScore: AuditScoreProps = {
			id: value?._id,
			categoryId: value?.question?.category?._id,
			categoryName: value?.question?.category?.name,
			categoryDescription: value?.question?.category.description,
			comment: value?.comment,
			example: value?.question?.example,
			hasDeviation: value?.has_deviation,
			image: value?.image,
			maxPoints: value?.question?.max_points,
			order: value?.question?.order,
			question: value?.question?.question,
			score: value?.score
		}

		return formattedAuditScore
	})
}

export const formatAudit = (value: any) => {
	const formattedReportPerArea: AuditProps = {
		id: value?._id,
		area: value?.area,
		createdAt: DateTime.fromISO(value.createdAt),
		createdBy: {
			id: value?.created_by?._id,
			email: value?.created_by?.email,
			firstname: value?.created_by?.first_name,
			lastname: value?.created_by?.last_name
		},
		status: value.status,
		scores: formatAuditScore(value.scores),
		checklist: {
			code: value?.checklist?.code,
			id: value?.checklist?._id,
			isShort: value?.checklist?.is_short,
			language: value?.checklist?.language,
			name: value?.checklist?.name,
			status: value?.checklist?.status,
			type: value?.checklist?.type,
			version: value?.checklist?.version,
			standard: value?.checklist.standard
		}
	}

	return formattedReportPerArea
}
export const formatAudits = (data: any): Array<AuditProps> => {
	return map(data, (value) => formatAudit(value))
}

export const logout = () => {
	localStorage.removeItem('token')
	window.location.reload()
}

export const getInitials = (user: UserProps) => {
	if (!user.firstname || !user.lastname) {
		return `${user.email.charAt(0)}`
	}
	return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`
}

export const getScore = ({
	scores,
	name
}: {
	scores: Array<AuditScoreProps>
	name: string
}): { score: number; length: number; maxPoints: number } => {
	const filteredScore = filter(scores, ({ categoryName }) => categoryName === name)
	const mappedScore = map(filteredScore, (value) => {
		return value.score
	})

	const finalScore = reduce(mappedScore, (prev, curr) => {
		return prev + curr
	})

	return {
		score: finalScore ? finalScore : 0,
		length: mappedScore ? mappedScore.length : 0,
		maxPoints: filteredScore[0]?.maxPoints
	}
}

const reportReducer = (value: Array<DasboardReportDataProps>, name: string) => {
	const reduced = reduce(value, (prev, curr) => {
		const values: DasboardReportDataProps = {
			name,
			s1: prev.s1 + curr.s1,
			s2: prev.s2 + curr.s2,
			s3: prev.s3 + curr.s3,
			s4: prev.s4 + curr.s4,
			s5: prev.s5 + curr.s5,
			s6: prev.s6 + curr.s6
		}
		return values
	})

	return {
		name: reduced?.name,
		s1: Math.round(reduced?.s1 ? reduced?.s1 / value.length : 0),
		s2: Math.round(reduced?.s2 ? reduced?.s2 / value.length : 0),
		s3: Math.round(reduced?.s3 ? reduced?.s3 / value.length : 0),
		s4: Math.round(reduced?.s4 ? reduced?.s4 / value.length : 0),
		s5: Math.round(reduced?.s5 ? reduced?.s5 / value.length : 0),
		s6: Math.round(reduced?.s6 ? reduced?.s6 / value.length : 0)
	}
}

const mapReportData = (report: any) => {
	return {
		name: report.createdAt.monthLong,
		year: report.createdAt.year,
		s1: getScore({ scores: report.scores, name: 'S1' }).score,
		s2: getScore({ scores: report.scores, name: 'S2' }).score,
		s3: getScore({ scores: report.scores, name: 'S3' }).score,
		s4: getScore({ scores: report.scores, name: 'S4' }).score,
		s5: getScore({ scores: report.scores, name: 'S5' }).score,
		s6: getScore({ scores: report.scores, name: 'S6' }).score
	}
}

export const getReport = (
	data: Array<AuditProps>
): Array<DasboardReportDataProps> | Array<any> => {
	const mappedReports = map(data, mapReportData)
	const groupedReports = groupBy(mappedReports, 'name')
	const ReducedReports = map(groupedReports, reportReducer)

	return ReducedReports ? ReducedReports : []
}

export const roundDataSixS = ({
	score,
	length,
	maxPoints
}: {
	score: number
	length: number
	maxPoints: number
}) => {
	const roundedValue = round((score / (length * maxPoints)) * 100)
	return roundedValue ? roundedValue : 0
}

export const getStatusIcon = (status: string) => {
	switch (status) {
		case 'todo':
			return <TodoIcon />
		case 'inprogress':
			return <InProgressIcon />
		case 'toreview':
			return <ToReviewIcon />
		case 'done':
			return <DoneIcon />
	}
}
