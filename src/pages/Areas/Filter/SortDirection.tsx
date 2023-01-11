import Checkbox from '@system/Checkbox'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { useTranslation } from 'react-i18next'

export enum SortDirection {
	ascending = 'asc',
	descending = 'desc'
}

export type SortDirectionProps = {
	value: string
	setValue: Dispatch<SetStateAction<SortDirection>>
}

const SortDirectionFilter: FC<SortDirectionProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')

	return (
		<FilterWrapper>
			<Title>{t('filters.sortDirection.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.sortDirection.asc')}
					value={value === SortDirection.ascending}
					onCheck={() => setValue(SortDirection.ascending)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.sortDirection.desc')}
					onCheck={() => setValue(SortDirection.descending)}
					value={value === SortDirection.descending}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default SortDirectionFilter
