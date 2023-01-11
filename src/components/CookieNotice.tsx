import Button from '@system/Button'
import { updateProfile } from 'api/Profile'
import Cookie from 'js-cookie'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
import Card from './Card'

const CookieNotice = () => {
	const { t } = useTranslation('common')
	const user = useMeState()
	const meDispatch = useMeDispatch()
	const portal = document.getElementById('modalPortal') as HTMLElement

	const updateCookieSettings = async (e: FormEvent) => {
		e.preventDefault()

		try {
			await updateProfile({
				...user,
				acceptCookies: true
			})

			meDispatch({
				type: MeActions.update,
				payload: {
					...user,
					acceptCookies: true
				}
			})
			Cookie.set('acpt', '1')
		} catch (error) {
			Cookie.set('acpt', '1')
			meDispatch({ type: MeActions.updateLoading, payload: false })
			console.error('error', error)
		}
	}

	const CookieNoticeComponent = (() => {
		if (
			(!user.isLoggedIn && Cookie.get('acpt')) ||
			user.isLoading ||
			user.acceptCookies
		) {
			return <></>
		}

		/* eslint-disable */
		return (
			<Wrapper>
				<CardWrapper shadow='wide'>
					<Text>
						<Trans
							t={t}
							i18nKey='cookie.notice'
							components={[
								<a
									href={`https://goleansigma.de/${
										Cookie.get('lng') === 'en' ? 'en-' : ''
									}pages/privacy-policy`}
								/>
							]}></Trans>
					</Text>
					<Actions>
						<Button size='small' onClick={updateCookieSettings}>
							{t('cookie.accept')}
						</Button>
					</Actions>
				</CardWrapper>
			</Wrapper>
		)
	})()
	return createPortal(CookieNoticeComponent, portal)
}

const Wrapper = styled.div`
	background: none;
	display: flex;
	position: fixed;
    left: auto;
    top: auto;
    right: 20px;
    bottom: 20px;
    z-index: 100;
}
`

const CardWrapper = styled(Card)`
	align-items: flex-start;
	background-color: ${(props) => props.theme.colors.neutral001};
	border-radius: 10px;
	border: none;
	box-shadow: 0 6px 18px 2px rgb(128 150 163 / 50%);
	display: flex;
	flex-direction: column;
	margin: 0;
	max-width: 450px;
	padding: 40px;
	width: 100%;
`

const Text = styled.span`
	color: ${(props) => props.theme.colors.neutral000};
	font-size: ${(props) => props.theme.font.sizes.medium};
	margin-bottom: 20px;

	& a {
		color: ${(props) => props.theme.colors.neutral000};
		text-decoration: underline;
	}
`

const Actions = styled.div`
	display: flex;
`

export default CookieNotice
