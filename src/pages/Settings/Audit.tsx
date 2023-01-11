import Button from '@system/Button'
import Checkbox from '@system/Checkbox'
import H from '@system/H'
import Input from '@system/Input'
import { updateProfile } from 'api/Profile'
import { Body, Footer, Header, Wrapper } from 'components/SettingsStyle'
import { ReactComponent as SaveIcon } from 'icons/save.svg'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { ToastActions, ToastTypes, useToastDispatch } from 'providers/Toast'
import { FC, FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const SixS: FC = () => {
	const { t } = useTranslation('common')
	const data = useMeState()

	const toastDispatch = useToastDispatch()
	const dispatch = useMeDispatch()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [targetScore, setTargetScore] = useState<number>(data.targetScore)
	const [is6s, setIs6s] = useState<boolean>(false)

	useEffect(() => {
		setTargetScore(data.targetScore)
		setIs6s(data.is6s)
	}, [data.targetScore, data.is6s])

	const updateSixS = async (e: FormEvent) => {
		e.preventDefault()

		setIsLoading(true)

		try {
			const res = await updateProfile({
				...data,
				targetScore,
				is6s
			})

			if (res.data.error) {
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileError',
						text: t('settings.toast.error'),
						type: ToastTypes.danger
					}
				})
			} else {
				dispatch({
					type: MeActions.update,
					payload: {
						...data,
						targetScore,
						is6s
					}
				})
				toastDispatch({
					type: ToastActions.add,
					payload: {
						id: 'UpdatingProfileSuccess',
						text: t('settings.toast.update', { settings: t('settings.audit.title') }),
						type: ToastTypes.info
					}
				})
				setIsLoading(false)
			}
		} catch (error) {
			console.error('error', error)
			setIsLoading(false)
		}
	}
	return (
		<Wrapper>
			<form onSubmit={updateSixS}>
				<Header>
					<H as='h4'>{t('settings.audit.title')}</H>
				</Header>
				<Body>
					<Input
						min={0}
						max={100}
						maxlength={100}
						type='number'
						value={targetScore}
						label={t('settings.audit.target')}
						onChange={(e) => setTargetScore(Number(e.currentTarget.value))}
					/>
					<H as='h5'>{t('settings.audit.6sAudit')}</H>
					<Checkbox
						onCheck={() => setIs6s((is6s) => !is6s)}
						value={is6s}
						label={t('settings.audit.switchTo6S.label')}
						description={t('settings.audit.switchTo6S.desc')}
					/>
				</Body>
				<Footer>
					<Button type='submit' loading={isLoading}>
						<SaveIcon />
						{t('settings.save')}
					</Button>
				</Footer>
			</form>
		</Wrapper>
	)
}

export default SixS
