import { ReactComponent as FiveSAuditIcon } from 'icons/5sAudit.svg'
import { ReactComponent as FiveSAuditShortIcon } from 'icons/5sAuditShort.svg'
import { ReactComponent as SixSAuditIcon } from 'icons/6sAudit.svg'
import { ReactComponent as SixSAuditShortIcon } from 'icons/6sAuditShort.svg'
import { DateTime } from 'luxon'
import { FC } from 'react'
import styled from 'styled-components/macro'
import { getElapseTime } from 'utils/helpers'

export type DashboardActivityProps = {
	date: string | DateTime
	description: string
	id: string
	isFullWidth?: boolean
	title: string
	type: string
	onClick: () => void
	standard: string
	isShort: boolean
}
const Activity: FC<DashboardActivityProps> = ({
	date,
	isShort,
	onClick,
	standard,
	title,
	type
}) => {
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

	return (
		<Wrapper onClick={onClick}>
			<ActivityWrapper>
				<Icon>{getIcon({ standard, isShort })}</Icon>
				<ActivityInfo>
					<Title>
						<TitleText>
							<TitleTextHighlight>{title}</TitleTextHighlight>
							<TitleTextMeta>Audited Area</TitleTextMeta>
						</TitleText>
						<DateString>
							<ElapsedTime>
								{getElapseTime(DateTime.fromJSDate(new Date(String(date))))}
							</ElapsedTime>
							<ExactDate>
								{DateTime.fromJSDate(new Date(String(date))).toFormat(
									'LLL dd yyyy hh:mm a'
								)}
							</ExactDate>
						</DateString>
					</Title>
				</ActivityInfo>
			</ActivityWrapper>
		</Wrapper>
	)
}

const ActivityWrapper = styled.div`
	display: flex;
	align-items: center;
`

const ActivityInfo = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`

const Icon = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	margin-right: 20px;
	& > svg {
		height: 40px;
		width: 40px;
	}
`

const Title = styled.div`
	align-items: center;
	display: flex;
	width: 100%;
`

const TitleText = styled.div`
	color: ${(props) => props.theme.colors.neutral000};
	display: flex;
	flex-direction: column;
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 500;
	letter-spacing: 0.02em;
	margin-right: auto;
`

const TitleTextHighlight = styled.span`
	font-weight: 700;
	font-size: 18px;
	color: ${(props) => props.theme.colors.neutral000};
`

const TitleTextMeta = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
`

const ElapsedTime = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.small};
	letter-spacing: 0.04em;
	margin-bottom: 10px;
	min-height: 13px;
`

const ExactDate = styled.div`
	color: ${(props) => props.theme.colors.neutral003};
	display: none;
	font-size: ${(props) => props.theme.font.sizes.small};
	letter-spacing: 0.04em;
	margin-bottom: 10px;
	min-height: 13px;
`

const DateString = styled.div`
	display: flex;
`

const Wrapper = styled.div`
	border-bottom: 1px solid ${(props) => props.theme.colors.neutral006};
	cursor: pointer;
	margin-bottom: 10px;
	padding: 15px 0;
	width: 100%;
	&:last-child {
		border-bottom: none;
	}

	&:hover {
		opacity: 0.75;
		& ${ElapsedTime} {
			display: none;
		}
		& ${ExactDate} {
			display: flex;
		}
	}
`
export default Activity
