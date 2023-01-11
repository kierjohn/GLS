import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export type TypeProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

const TypeFilter: FC<TypeProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	return (
		<FilterWrapper>
			<Title>{t('filters.type.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.type.all')}
					value={value === 'all'}
					onCheck={() => setValue('all')}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.type.production')}
					value={value === 'Production'}
					onCheck={() => setValue('Production')}
				/>
			</CheckboxWrapper>

			<CheckboxWrapper>
				<Checkbox
					label={t('filters.type.laboratory')}
					value={value === 'Laboratory'}
					onCheck={() => setValue('Laboratory')}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.type.office')}
					value={value === 'Office'}
					onCheck={() => setValue('Office')}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default TypeFilter
