import H from '@system/H'
import { revCatApi } from 'api'
import { Header } from 'components/SettingsStyle'
import { isNil } from 'lodash'
import { DateTime } from 'luxon'
import Item, { PlanBenefit } from 'pages/Homepage/Plans/item'
import { useMeState } from 'providers/Me'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

const Subscription: FC = () => {
	const { t } = useTranslation('common')
	const { id } = useMeState()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [currentPlan, setCurrentPlan] = useState<string>()
	const [expiration, setExpiration] = useState<DateTime>()

	useEffect(() => {
		const fn = async () => {
			setIsLoading(true)

			const res = await revCatApi.get(`/subscribers/${id}`, {
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + process.env.REACT_APP_REV_CAT_AUTH
				}
			})

			if (Object.keys(res.data.subscriber.entitlements).length === 0) {
				setCurrentPlan('free')
			} else {
				setCurrentPlan(res.data.subscriber.entitlements.premium.product_identifier)
				setExpiration(
					DateTime.fromISO(res.data.subscriber.entitlements.premium.expires_date)
				)
			}

			setIsLoading(false)
		}

		if (id) {
			fn()
		}
	}, [id])

	return (
		<Wrapper>
			<Header>
				<H as='h4'>{t('settings.subscription.title')}</H>
			</Header>
			{isLoading ? (
				<div>loading</div>
			) : (
				<Plans>
					<Item
						type='free'
						benefits={
							<>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
								<PlanBenefit>{t('plans.free.feature')}</PlanBenefit>
							</>
						}
						isSubscribe={currentPlan !== 'gls_119_1y' && currentPlan !== 'gls_11_1m'}
						expiration={expiration}
					/>
					<Item
						type='monthly'
						benefits={
							<>
								<PlanBenefit>{t('plans.monthly.feature.oneMonthFree')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.cancellable')}</PlanBenefit>
							</>
						}
						isSubscribe={currentPlan === 'gls_11_1m'}
						expiration={expiration}
					/>
					<Item
						type='yearly'
						benefits={
							<>
								<PlanBenefit>{t('plans.monthly.feature.oneMonthFree')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedAudits')}</PlanBenefit>
								<PlanBenefit>{t('plans.monthly.feature.unlimitedReports')}</PlanBenefit>
								<PlanBenefit>{t('plans.yearly.feature.cancellable')}</PlanBenefit>
							</>
						}
						isSubscribe={currentPlan === 'gls_119_1y'}
						expiration={expiration}
					/>
				</Plans>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 30px;
`

const Plans = styled.div`
	display: flex;
	margin-top: 30px;
`

export default Subscription
