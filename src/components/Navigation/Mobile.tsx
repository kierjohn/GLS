import { MenuItemLink, MenuItems, MenuText } from 'components/UserContextMenu'
import { useMeState } from 'providers/Me'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'
export type NavigationMobileProps = {
	isApp?: boolean
	isFixed: boolean
	isOpen: boolean
	setIsOpen: Dispatch<SetStateAction<boolean>>
}

const NavigationMobile: FC<NavigationMobileProps> = ({ isFixed, isOpen }) => {
	const { t } = useTranslation('common')
	const user = useMeState()

	return (
		<Wrapper isFixed={isFixed}>
			<NavLinks isOpen={isOpen}>
				<MenuItems>
					<MenuItemLink to='/'>
						<MenuText>{t('nav.dashboard')}</MenuText>
					</MenuItemLink>
					{user.role === 1 && (
						<>
							<MenuItemLink to='/users'>
								<MenuText>Users</MenuText>
							</MenuItemLink>
							<MenuItemLink to='/questions'>
								<MenuText>Questions</MenuText>
							</MenuItemLink>
						</>
					)}
					<MenuItemLink to='/areas'>
						<MenuText>{t('nav.areas')}</MenuText>
					</MenuItemLink>
					<MenuItemLink to='/tasks'>
						<MenuText>{t('nav.tasks')}</MenuText>
					</MenuItemLink>

					<MenuItemLink to='/audits'>
						<MenuText>{t('nav.audits')}</MenuText>
					</MenuItemLink>
					<MenuItemLink to='/reports'>
						<MenuText>{t('nav.reports')}</MenuText>
					</MenuItemLink>
				</MenuItems>
			</NavLinks>
		</Wrapper>
	)
}

const NavLinks = styled.div<{ isOpen: boolean }>`
	display: ${(props) => (props.isOpen ? 'flex' : 'none')};
	flex-direction: column;
	height: calc(100% - 60px);
	overflow: auto;
	width: 100vw;
`

const Wrapper = styled.div<{ isFixed?: boolean }>`
	align-items: center;
	background-color: ${(props) => props.theme.colors.neutral001};
	box-shadow: ${(props) => props.theme.shadows.wide};
	flex-direction: column;
	justify-content: center;
	left: 0;
	margin-top: 60px;
	overflow: auto;
	position: fixed;
	top: 0;
	width: 100vw;
	z-index: 100000;
	& > a {
		width: fit-content;
	}

	@media screen and (min-width: 1200px) {
		display: none;
	}
`

export default NavigationMobile
