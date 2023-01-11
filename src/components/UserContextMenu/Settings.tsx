import { ReactComponent as SixSIcon } from 'icons/6s.svg'
import { ReactComponent as AccountIcon } from 'icons/account.svg'
import { ReactComponent as BackIcon } from 'icons/arrowBackwardSmall.svg'
import { ReactComponent as PasswordIcon } from 'icons/password.svg'
import { ReactComponent as PersonIcon } from 'icons/person.svg'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { MenuItem, MenuItemLink, MenuItems, MenuText } from '.'

export type SettingsType = {
	setIsActive: Dispatch<SetStateAction<boolean>>
	setIsContextOpen: Dispatch<SetStateAction<boolean>>
}

const Settings: FC<SettingsType> = ({ setIsActive, setIsContextOpen }) => {
	const { t } = useTranslation('common')

	return (
		<MenuItems>
			<MenuItem onClick={() => setIsActive(false)}>
				<BackIcon />
				<MenuText>{t('userContext.ucSettings.back')}</MenuText>
			</MenuItem>

			<MenuItemLink onClick={() => setIsContextOpen(false)} to='/settings/personal'>
				<PersonIcon />
				<MenuText>{t('userContext.ucSettings.personalInformation')}</MenuText>
			</MenuItemLink>

			<MenuItemLink onClick={() => setIsContextOpen(false)} to='/settings/account'>
				<AccountIcon />
				<MenuText>{t('userContext.ucSettings.accountInformation')}</MenuText>
			</MenuItemLink>

			<MenuItemLink onClick={() => setIsContextOpen(false)} to='/settings/password'>
				<PasswordIcon />
				<MenuText>{t('userContext.ucSettings.passwordSettings')}</MenuText>
			</MenuItemLink>

			<MenuItemLink onClick={() => setIsContextOpen(false)} to='/settings/sixs'>
				<SixSIcon />
				<MenuText>{t('userContext.ucSettings.AuditSettings')}</MenuText>
			</MenuItemLink>
			{/* <MenuItemLink onClick={() => setIsContextOpen(false)} to='/settings/subscription'>
				<DiamondIcon />
				<MenuText>{t('userContext.ucSettings.subscription')}</MenuText>
			</MenuItemLink> */}
		</MenuItems>
	)
}

export default Settings
