import H from '@system/H'
import Text from '@system/Text'
import List from 'components/List'
import Data from 'components/List/Item/Data'
import Pagination from 'components/Pagination'
import MainLayout from 'layout/MainLayout'
import { map, reduce } from 'lodash'
import { useAuditsState } from 'providers/Audits'
import { AuditProps, AuditScoreProps } from 'providers/Audits/types'
import { useFetchFilteredAudits } from 'providers/Audits/useFetchFilteredAudits'
import { useMeState } from 'providers/Me'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ReactComponent as SixSAuditIcon } from 'icons/6sAudit.svg'
import { ReactComponent as SixSAuditShortIcon } from 'icons/6sAuditShort.svg'
import { ReactComponent as FiveSAuditIcon } from 'icons/5sAudit.svg'
import { ReactComponent as FiveSAuditShortIcon } from 'icons/5sAuditShort.svg'
import { ReactComponent as CheckIcon } from 'icons/check.svg'
import { ReactComponent as TimesIcon } from 'icons/times.svg'

const Audits = () => {
	const { t } = useTranslation('common')
	const navigate = useNavigate()

	const { data: audits, isLoading, count } = useAuditsState()
	const { targetScore, is6s, id } = useMeState()

	const [page, setPage] = useState<number>(1)
	const [limit] = useState<number>(10)

	const onEditItem = (audit: AuditProps) => {
		navigate(`/audits/${audit.id}`)
	}

	const getIcon = ({ standard, isShort }: { standard?: string; isShort?: boolean }) => {
		if (standard === '5s') {
			if (isShort) {
				return <FiveSAuditShortIcon />
			}
			return <FiveSAuditIcon />
		} else {
			if (isShort) {
				return <SixSAuditShortIcon />
			}
			return <SixSAuditIcon />
		}
	}

	useFetchFilteredAudits({
		limit,
		page,
		standard: is6s ? '6s' : '5s',
		userId: id,
		isShort: 'all'
	})

	return (
		<MainLayout isApp>
			<Helmet>
				<title>Audits</title>
			</Helmet>
			<Wrapper>
				<AuditWrapper>
					<List
						data={audits}
						emptyStatetext={
							<>
								<H as='h4'>{t('audits.emptyState.title')}</H>
								<Text>{t('audits.emptyState.text')}</Text>
							</>
						}
						ghostLoading={{
							dataCount: 3,
							itemCount: 4
						}}
						isLoading={isLoading}
						title={t('audits.title')}
						itemFormat={(value: AuditProps) => {
							const totalScore = (): number => {
								const mappedScore = map(value.scores, (score: AuditScoreProps) => {
									return score.score
								})
								return Number(reduce(mappedScore, (curr, next) => curr + next))
							}
							return (
								<>
									<Data
										width={40}
										value={
											<IconWrapper>
												{getIcon({
													standard: value?.checklist?.standard,
													isShort: value?.checklist?.isShort
												})}
											</IconWrapper>
										}
									/>

									<Data
										value={value.area?.title}
										text={t('audits.area')}
										isBlocked={true}
									/>
									<Data
										value={value.createdAt.toFormat('DD')}
										text={t('audits.date')}
										isBlocked={true}
										desktopOnly
									/>
									{value?.checklist?.isShort ? (
										<>
											<Data
												value={`${Math.round(
													(totalScore() / value.scores.length) * 100
												)}%`}
												text={t('audits.score')}
												desktopOnly
											/>
											<Data
												width={120}
												value={
													<Remark>
														{Math.round((totalScore() / value.scores.length) * 100) >=
														targetScore ? (
															<RemarkIcon passed>
																<CheckIcon />
															</RemarkIcon>
														) : (
															<RemarkIcon>
																<TimesIcon />
															</RemarkIcon>
														)}
														{totalScore() >= targetScore
															? t('audits.passed')
															: t('audits.failed')}
													</Remark>
												}
											/>
										</>
									) : (
										<>
											<Data
												value={`${totalScore()}%`}
												text={t('audits.score')}
												desktopOnly
											/>
											<Data
												width={120}
												value={
													<Remark>
														{totalScore() >= targetScore ? (
															<RemarkIcon passed>
																<CheckIcon />
															</RemarkIcon>
														) : (
															<RemarkIcon>
																<TimesIcon />
															</RemarkIcon>
														)}
														{totalScore() >= targetScore
															? t('audits.passed')
															: t('audits.failed')}
													</Remark>
												}
											/>
										</>
									)}
								</>
							)
						}}
						onListItemClick={onEditItem}
					/>
					<Pagination count={count} limit={limit} page={page} setPage={setPage} />
				</AuditWrapper>
			</Wrapper>
		</MainLayout>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	width: 100%;
`
const AuditWrapper = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`

const IconWrapper = styled.div`
	& > svg {
		width: 32px;
		height: 32px;
	}
`

const Remark = styled.div`
	display: flex;
	grid-gap: 10px;
`
const RemarkIcon = styled.div<{ passed?: boolean }>`
	background: ${(props) =>
		props.passed ? props.theme.colors.success : props.theme.colors.danger};
	color: ${(props) => props.theme.colors.neutral001};

	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 20px;
	& > svg {
		width: 12px;
		height: 12px;
	}
`
export default Audits
