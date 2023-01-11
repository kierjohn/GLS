import Button from '@system/Button'
import { ReactComponent as CircleIcon } from 'icons/circle.svg'
import { ReactComponent as MonthlyIcon } from 'icons/monthly.svg'
import { ReactComponent as YearlyIcon } from 'icons/yearly.svg'
import { isNil } from 'lodash'
import { DateTime } from 'luxon'
import { FC, Fragment, ReactNode } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import theme from 'theme'

export type PlansItemProps = {
	type: 'free' | 'monthly' | 'yearly'
	benefits: ReactNode
	isSubscribe: boolean
	expiration?: DateTime
}

const Item: FC<PlansItemProps> = ({ type, benefits, isSubscribe, expiration }) => {
	const { t } = useTranslation('common')
	const navigate = useNavigate()

	const getIcon = () => {
		switch (type) {
			case 'monthly':
				return <MonthlyIcon />
			case 'yearly':
				return <YearlyIcon />
			default:
				return <CircleIcon />
		}
	}

	const getColor = () => {
		switch (type) {
			case 'monthly':
				return theme('light').colors.s4
			case 'yearly':
				return theme('light').colors.warning
			default:
				return theme('light').colors.s3
		}
	}

	const getExpiration = () => {
		if (!isSubscribe || isNil(expiration)) {
			return 0
		}
		return Math.floor(DateTime.now().diff(expiration, ['days']).as('days'))
	}

	return (
		<Wrapper animateIn='fadeItenUp' duration={0.75} animateOnce={true} delay={30}>
			<PlanIcon style={{ color: getColor() }}>{getIcon()}</PlanIcon>
			<PlanTitle color={getColor()}>{t(`plans.${type}.title`)}</PlanTitle>
			<PlanText>
				<Trans t={t} i18nKey={`plans.${type}.text`} components={[<Highlight />]}></Trans>
			</PlanText>
			<PlanPrice>
				{t(`plans.${type}.price`)}
				{type !== 'free' && <CurrencyTerm>{t('plans.currencyPerMonth')}</CurrencyTerm>}
			</PlanPrice>
			<PlanBenefitWrapper>{benefits}</PlanBenefitWrapper>
			{isSubscribe ? (
				<>
					<PlanStatus>{t('plans.current')}</PlanStatus>
					{isSubscribe && expiration && (
						<>
							{getExpiration() > 0 ? (
								<PlanNotice isDanger>
									<Trans
										t={t}
										i18nKey='plans.expired'
										values={{ expiration: getExpiration() }}></Trans>
								</PlanNotice>
							) : (
								<PlanNotice>
									<Trans
										t={t}
										i18nKey='plans.willExpire'
										values={{ expiration: getExpiration() }}></Trans>
								</PlanNotice>
							)}
						</>
					)}
				</>
			) : (
				<>
					<PlanButton
						isBlocked
						color={theme('light').colors.s4}
						onClick={() => navigate('/goleansigmaapp')}>
						{t('plans.download')}
					</PlanButton>
					<PlanNotice>{t('plans.download.notice')}</PlanNotice>
				</>
			)}
		</Wrapper>
	)
}

const Wrapper = styled(ScrollAnimation)`
	background-color: ${(props) => props.theme.colors.neutral001};
	border-radius: ${(props) => props.theme.radius.large};
	border: 1px solid ${(props) => props.theme.colors.neutral004};
	box-shadow: ${(props) => props.theme.shadows.default};
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 20px;
	padding: 40px 20px;
	position: relative;
	@media screen and (min-width: 992px) {
		margin: 0 20px;
	}
`

const PlanIcon = styled.div`
	margin-bottom: 10px;
	height: 50px;
`

const PlanTitle = styled.h3<{ color: string }>`
	font-size: ${(props) => props.theme.font.sizes.h2};
	font-family: ${(props) => props.theme.font.family.header};
	font-weight: 800;
	color: ${(props) => props.color};
	margin-bottom: 10px;
`

const PlanText = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
`

const Highlight = styled.span`
	font-weight: 800;
	color: ${(props) => props.theme.colors.neutral000};
	font-size: 1em;
`

const PlanPrice = styled.div`
	font-size: ${(props) => props.theme.font.sizes.h3};
	font-family: ${(props) => props.theme.font.family.header};
	font-weight: 800;
	padding: 20px 0;
`

const CurrencyTerm = styled.span`
	font-size: 0.75em;
	font-family: ${(props) => props.theme.font.family.header};
	font-weight: 800;
	padding: 20px 0;
`

const PlanBenefitWrapper = styled.ul`
	margin-bottom: 20px;
`

export const PlanBenefit = styled.li`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
	margin-bottom: 15px;
`

const PlanStatus = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: 16px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	text-align: center;
	text-decoration: underline;
`

const PlanButton = styled(Button)<{ color: string }>`
	color: ${(props) => props.theme.colors.neutral001};
	margin-top: auto;
`

const PlanNotice = styled.span<{ isDanger?: boolean }>`
	font-size: 12px;
	color: ${(props) =>
		props.isDanger ? props.theme.colors.danger : props.theme.colors.neutral003};
	text-align: center;
	margin-top: 12px;
`
export default Item
