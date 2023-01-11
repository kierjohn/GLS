import { updateProfile } from 'api/Profile'
import { ReactComponent as DEFlag } from 'icons/deFlag.svg'
import { ReactComponent as USFlag } from 'icons/usFlag.svg'
import Cookie from 'js-cookie'
import { useMeDispatch, useMeState } from 'providers/Me'
import { MeActions } from 'providers/Me/types'
import React, { FC } from 'react'
import styled from 'styled-components/macro'

const LanguageSelector: FC = () => {
	const meDispatch = useMeDispatch()
	const user = useMeState()

	const toggleLanguage = async () => {
		const cookieLanguage = Cookie.get('lng') ? Cookie.get('lng') : 'en'
		const currLanguage = user.isLoggedIn ? user.language : cookieLanguage
		const updatedLanguage = currLanguage === 'de' ? 'en' : 'de'

		try {
			await updateProfile({
				...user,
				language: updatedLanguage
			})

			meDispatch({
				type: MeActions.update,
				payload: {
					...user,
					language: updatedLanguage
				}
			})

			Cookie.set('lng', updatedLanguage)
			window.location.reload()
		} catch (error) {
			Cookie.set('lng', updatedLanguage)
			meDispatch({ type: MeActions.updateLoading, payload: false })
			console.error('error', error)
		}
	}

	return (
		<Wrapper
			language={user.isLoggedIn ? user.language : `${Cookie.get('lng')}`}
			onClick={toggleLanguage}>
			<LanguagesWrapper
				language={user.isLoggedIn ? user.language : `${Cookie.get('lng')}`}>
				<LanguageWrapper>
					<FlagWrapper>
						<USFlag />
					</FlagWrapper>
					<span>EN</span>
				</LanguageWrapper>
				<LanguageWrapper>
					<FlagWrapper>
						<DEFlag />
					</FlagWrapper>
					<span>DE</span>
				</LanguageWrapper>
			</LanguagesWrapper>
		</Wrapper>
	)
}

const LanguagesWrapper = styled.div<{ language: string }>`
	display: flex;
	transform: translateX(${(props) => (props.language === 'de' ? '-75px' : '-5px')});
	transition: transform 250ms ease-in-out;
`

const Wrapper = styled.div<{ language: string }>`
	align-items: center;
	border-radius: 30px;
	border: 1px solid transparent;
	cursor: pointer;
	display: flex;
	font-weight: 800;
	overflow: hidden;
	padding: 5px;
	text-transform: uppercase;
	transition: background 250ms ease-in-out;
	user-select: none;
	width: 75px;
	overflow: hidden;
	&:hover {
		background-color: ${(props) => props.theme.colors.neutral005};
		border-color: ${(props) => props.theme.colors.neutral004};
	}
	&:active {
		opacity: 0.5;
	}
`

const LanguageWrapper = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
	width: 60px;
	margin: 0 5px;
`

const FlagWrapper = styled.div`
	height: 25px;
	overflow: hidden;
	width: 25px;
	margin-right: 10px;
`

export default LanguageSelector
