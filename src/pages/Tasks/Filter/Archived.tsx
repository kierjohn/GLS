import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export type ArchivedProps = {
	value: boolean
	setValue: Dispatch<SetStateAction<boolean>>
}

const Archived: FC<ArchivedProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')

	return (
		<FilterWrapper>
			<Title>{t('filters.archived.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.archived.showArchived')}
					value={value}
					onCheck={() => setValue((value) => !value)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default Archived
