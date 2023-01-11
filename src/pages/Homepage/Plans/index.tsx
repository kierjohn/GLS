import Button from '@system/Button'
import H from '@system/H'
import { ReactComponent as AndroidIcon } from 'icons/android.svg'
import { ReactComponent as CircleIcon } from 'icons/circle.svg'
import { ReactComponent as MonthlyIcon } from 'icons/monthly.svg'
import { ReactComponent as CloseIcon } from 'icons/times.svg'
import { ReactComponent as YearlyIcon } from 'icons/yearly.svg'
import { transparentize } from 'polished'
import { useState } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import theme from 'theme'

const Plans = () => {
	const { t } = useTranslation('common')
	const [isMonthlySelected, setIsMonthlySelected] = useState<boolean>(false)
	const [isYearlySelected, setIsYearlySelected] = useState<boolean>(false)

	const togglePlan = (plan: 'monthly' | 'yearly') => {
		if (plan === 'monthly') {
			setIsMonthlySelected(true)
			setIsYearlySelected(false)
		} else {
			setIsMonthlySelected(false)
			setIsYearlySelected(true)
		}
	}

	const DownloadPrompt = ({ plan }: { plan: 'monthly' | 'yearly' }) => (
		<DownloadNotification>
			<Close
				onClick={() =>
					plan === 'monthly' ? setIsMonthlySelected(false) : setIsYearlySelected(false)
				}>
				<CloseIcon />
			</Close>
			<AndroidIcon />

			<DownloadTitle>{t('plans.download.title')}</DownloadTitle>
			<DownloadText>{t('plans.download.text')}</DownloadText>
			<DownloadButton
				target='_blank'
				href='https://play.google.com/store/apps/details?id=com.goleansigma.audit&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
				{t('plans.download.title')}
			</DownloadButton>
		</DownloadNotification>
	)

	return (
		<Wrapper>
			<Content>
				<ScrollAnimation
					animateIn='fadeInUp'
					duration={0.75}
					animateOnce={true}
					delay={20}>
					<H as='h2'>{t('plans.title')}</H>
				</ScrollAnimation>
				<PlansWrapper>
					<PlanItem animateIn='fadeItenUp' duration={0.75} animateOnce={true} delay={30}>
						<PlanIcon style={{ color: theme('light').colors.s3 }}>
							<CircleIcon />
						</PlanIcon>
						<PlanTitle color={theme('light').colors.s3}>
							{t('plans.free.title')}
						</PlanTitle>
						<PlanText>{t('plans.free.text')}</PlanText>
						<PlanPrice>{t('plans.free.price')}</PlanPrice>
						<PlanBenefitWrapper>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
							<PlanBenefit>{t('plans.free.feature')}</PlanBenefit>
						</PlanBenefitWrapper>
						<PlanButton isBlocked to='/signup' color={theme('light').colors.s3}>
							{t('plans.free')}
						</PlanButton>
					</PlanItem>

					<PlanItem animateIn='fadeItenUp' duration={0.75} animateOnce={true} delay={30}>
						<PlanIcon>
							<MonthlyIcon />
						</PlanIcon>
						<PlanTitle color={theme('light').colors.s4}>
							{t('plans.monthly.title')}
						</PlanTitle>
						<PlanText>{t('plans.monthly.text')}</PlanText>
						<PlanPrice>
							{t('plans.monthly.price')}
							<CurrencyTerm>{t('plans.currencyPerMonth')}</CurrencyTerm>
						</PlanPrice>
						<PlanBenefitWrapper>
							<PlanBenefit>{t('plans.monthly.feature.oneMonthFree')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.cancellable')}</PlanBenefit>
						</PlanBenefitWrapper>
						<PlanButton
							onClick={() => togglePlan('monthly')}
							isBlocked
							color={theme('light').colors.s4}>
							{t('plans.subscribe')}
						</PlanButton>
						{isMonthlySelected && <DownloadPrompt plan='monthly' />}
					</PlanItem>

					<PlanItem animateIn='fadeInUp' duration={0.75} animateOnce={true} delay={40}>
						<RecommendBadge>{t('plans.recommended')}</RecommendBadge>
						<PlanIcon>
							<YearlyIcon />
						</PlanIcon>
						<PlanTitle color={theme('light').colors.warning}>
							{t('plans.yearly.title')}
						</PlanTitle>
						<PlanText>
							<Trans
								t={t}
								i18nKey='plans.yearly.text'
								components={[<Highlight />]}></Trans>
						</PlanText>
						<PlanPrice>
							{t('plans.yearly.price')}
							<CurrencyTerm>{t('plans.currencyPerYear')}</CurrencyTerm>
						</PlanPrice>
						<PlanBenefitWrapper>
							<PlanBenefit>{t('plans.monthly.feature.oneMonthFree')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
							<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
							<PlanBenefit>{t('plans.yearly.feature.cancellable')}</PlanBenefit>
						</PlanBenefitWrapper>
						<PlanButton
							onClick={() => togglePlan('yearly')}
							isBlocked
							color={theme('light').colors.warning}>
							{t('plans.subscribe')}
						</PlanButton>
						{isYearlySelected && <DownloadPrompt plan='yearly' />}
					</PlanItem>
				</PlansWrapper>
			</Content>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	background-color: ${(props) => props.theme.colors.neutral005};
	width: 100%;
	padding: 100px 0;
`

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 1200px;
	width: 100%;
`

const PlansWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 40px;
	@media screen and (min-width: 992px) {
		flex-direction: row;
	}
`

const PlanItem = styled(ScrollAnimation)`
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

const PlanBenefit = styled.li`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.large};
	margin-bottom: 15px;
`

const PlanButton = styled(Button)<{ color: string }>`
	background-color: ${(props) => props.color};
	color: ${(props) => props.theme.colors.neutral001};
	margin-top: auto;
`

const RecommendBadge = styled.div`
	background-color: ${(props) => props.theme.colors.success};
	border-radius: 12px;
	color: ${(props) => props.theme.colors.neutral001};
	font-weight: 800;
	padding: 5px 20px;
	position: absolute;
	right: 20px;
	top: 20px;
`

const DownloadNotification = styled.div`
	align-items: center;
	backdrop-filter: blur(25px);
	background-color: ${(props) => transparentize(0.25, props.theme.colors.neutral001)};
	border-radius: ${(props) => props.theme.radius.large};
	display: flex;
	flex-direction: column;
	height: 100%;
	justify-content: center;
	left: 0;
	padding: 20px 30px;
	position: absolute;
	top: 0;
	width: 100%;
`

const Close = styled.button`
	background: none;
	border-radius: ${(props) => props.theme.radius.round};
	cursor: pointer;
	height: 30px;
	position: absolute;
	right: 20px;
	top: 20px;
	width: 30px;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral001};
	}
`
const DownloadTitle = styled.h4`
	font-size: ${(props) => props.theme.font.sizes.h3};
	font-weight: 700;
	margin-bottom: 20px;
	margin-top: 40px;
`

const DownloadText = styled.span`
	color: ${(props) => props.theme.colors.neutral003};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 400;
	text-align: center;
`

const DownloadButton = styled.a`
	background-color: ${(props) => props.theme.colors.success};
	border-radius: ${(props) => props.theme.radius.round};
	color: ${(props) => props.theme.colors.neutral001};
	font-size: ${(props) => props.theme.font.sizes.large};
	font-weight: 800;
	padding: 10px 25px;
	margin-top: 40px;
`

export default Plans
