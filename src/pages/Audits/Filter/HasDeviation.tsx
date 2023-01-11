import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export enum HasDeviation {
	all = 0,
	yes = 1,
	no = 2
}

export type HasDeviationProps = {
	value: number
	setValue: Dispatch<SetStateAction<number>>
}

const HasDeviationFilter: FC<HasDeviationProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	return (
		<FilterWrapper>
			<Title>{t('filters.HasDeviation.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.HasDeviation.all')}
					value={value === HasDeviation.all}
					onCheck={() => setValue(HasDeviation.all)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.HasDeviation.yes')}
					value={value === HasDeviation.yes}
					onCheck={() => setValue(HasDeviation.yes)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.HasDeviation.no')}
					value={value === HasDeviation.no}
					onCheck={() => setValue(HasDeviation.no)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default HasDeviationFilter
