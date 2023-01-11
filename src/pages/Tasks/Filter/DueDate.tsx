import Checkbox from '@system/Checkbox'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { useTranslation } from 'react-i18next'

export enum Due {
	all = 'ALL',
	done = 'DONE',
	none = 'none',
	overdue = 'OVERDUE'
}

export type DueProps = {
	value: string
	setValue: Dispatch<SetStateAction<Due>>
}

const DueFilter: FC<DueProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	return (
		<FilterWrapper>
			<Title>{t('filters.due.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.due.none')}
					value={value === Due.none}
					onCheck={() => setValue(Due.none)}
				/>
			</CheckboxWrapper>

			<CheckboxWrapper>
				<Checkbox
					label={t('filters.due.all')}
					value={value === Due.all}
					onCheck={() => setValue(Due.all)}
				/>
			</CheckboxWrapper>

			<CheckboxWrapper>
				<Checkbox
					label={t('filters.due.overdue')}
					value={value === Due.overdue}
					onCheck={() => setValue(Due.overdue)}
				/>
			</CheckboxWrapper>

			<CheckboxWrapper>
				<Checkbox
					label={t('filters.due.done')}
					value={value === Due.done}
					onCheck={() => setValue(Due.done)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default DueFilter
