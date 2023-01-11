import Button from '@system/Button'
import H from '@system/H'
import Text from '@system/Text'
import api from 'api'
import { ChecklistProps, getChecklist } from 'api/Checklist'
import { getQuestions } from 'api/Questions'
import axios from 'axios'
import Card from 'components/Card'
import List, { EmptyStateText, EmptyStateWrapper } from 'components/List'
import Data from 'components/List/Item/Data'
import { ReactComponent as BackIcon } from 'icons/back.svg'
import MainLayout from 'layout/MainLayout'
import { filter, map, uniqBy } from 'lodash'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components/macro'
import Form from './DetailedForm'

const Details = () => {
	const { checklistId } = useParams()

	const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(true)
	const [isChecklistLoading, setIsChecklistLoading] = useState<boolean>(true)
	const [questions, setQuestions] = useState<Array<any>>([])
	const [categories, setCategories] = useState<Array<any>>([])
	const [allCategories, setAllCategories] = useState<Array<any>>([])
	const [checklist, setChecklist] = useState<ChecklistProps>()

	const [formValue, setFormValue] = useState<any>()
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
	const [lastReset, setLastReset] = useState<Date>(new Date())

	useEffect(() => {
		const fn = async () => {
			const source = axios.CancelToken.source()
			setIsChecklistLoading(true)

			try {
				const result = await getChecklist({
					source,
					id: checklistId
				})

				setChecklist(result.data.data)
				setIsChecklistLoading(false)
			} catch (error) {
				console.error(error)
				setIsChecklistLoading(false)
			}
		}

		fn()
	}, [lastReset, checklistId])

	useEffect(() => {
		const fn = async () => {
			try {
				const {
					data: { data: categories }
				} = await api.get('category/list/all')

				setAllCategories(categories)
			} catch (error) {
				console.error(error)
			}
		}
		fn()
	}, [lastReset, checklistId])

	useEffect(() => {
		const fn = async () => {
			const source = axios.CancelToken.source()

			setIsQuestionsLoading(true)
			try {
				const result = await getQuestions({
					source,
					checklist: checklistId
				})

				const categories: any = map(uniqBy(result.data.data, 'category._id'), 'category')

				setQuestions(result.data.data)
				setCategories(categories)
				setIsQuestionsLoading(false)
			} catch (error) {
				console.error(error)
				setIsQuestionsLoading(false)
			}
		}
		fn()
	}, [lastReset, checklistId])

	const onCreateArea = () => {
		setIsEdit(false)
		setIsFormVisible(true)
		setFormValue(undefined)
	}

	const onEditItem = (value: any) => {
		setFormValue(value)
		setIsEdit(true)
		setIsFormVisible(true)
	}

	return (
		<MainLayout isApp>
			<Form
				categories={allCategories}
				initValue={formValue}
				isEdit={isEdit}
				isVisible={isFormVisible}
				setIsVisible={setIsFormVisible}
				setLastReset={setLastReset}
			/>
			<Helmet>
				<title>Questions</title>
			</Helmet>
			<Wrapper>
				{isQuestionsLoading && isChecklistLoading && <div>loading...</div>}

				{!isQuestionsLoading && !isChecklistLoading && (
					<>
						<Header>
							<Back to='/questions'>
								<BackIcon />
							</Back>
							<H as='h3'>{checklist?.name}</H>
							<Version>
								<Text>{`Version: ${checklist?.version}`}</Text>
							</Version>
							<Button onClick={onCreateArea}>Add question</Button>
						</Header>
						{map(categories, (category: any) => {
							const groupedQuestions = filter(
								questions,
								(question: any) => question.category._id === category._id
							)

							return (
								<Card>
									<CardHeader>
										<H as='h4'>
											{category.name}
											{category.description ? ` - ${category.description}` : ''}
										</H>
									</CardHeader>
									<List
										hasPadding={false}
										data={groupedQuestions}
										isLoading={false}
										itemFormat={(value) => {
											return (
												<>
													<Data width={50} value={value.max_points} text='max' />
													<Data
														width={30}
														value={value.question}
														text={value.example}
														isBlocked
													/>
													<Data
														width={100}
														value={DateTime.fromJSDate(
															new Date(
																value.updatedAt ? value.updatedAt : value.createdAt
															)
														).toFormat('DD')}
														text='Last update'
													/>
												</>
											)
										}}
										onListItemClick={onEditItem}
									/>
								</Card>
							)
						})}
					</>
				)}
				{!isQuestionsLoading && !isChecklistLoading && !questions?.length && (
					<EmptyStateWrapper>
						<EmptyStateText>No data</EmptyStateText>
					</EmptyStateWrapper>
				)}
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	padding: 30px;
	max-width: 800px;
`
const Header = styled.div`
	display: flex;
	margin-bottom: 30px;
	align-items: center;
`

const Back = styled(Link)`
	margin-right: 10px;
	color: ${(props) => props.theme.colors.neutral000};
`

const Version = styled.div`
	margin-left: 10px;
	margin-right: auto;
`

const CardHeader = styled.div`
	padding: 15px;
	margin-bottom: 30px;
`

export default Details
