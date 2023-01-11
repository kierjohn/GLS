import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export enum SortBy {
	dateCreated = 'createdAt',
	name = 'name',
	description = 'description'
}

export type SortByProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

const SortByFilter: FC<SortByProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	return (
		<FilterWrapper>
			<Title>{t('filters.sortBy.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.sortBy.name')}
					value={value === SortBy.name}
					onCheck={() => setValue(SortBy.name)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.sortBy.description')}
					value={value === SortBy.description}
					onCheck={() => setValue(SortBy.description)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.sortBy.dateCreated')}
					value={value === SortBy.dateCreated}
					onCheck={() => setValue(SortBy.dateCreated)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default SortByFilter
