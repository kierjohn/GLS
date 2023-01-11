import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export enum Priority {
	all = '',
	high = 'High',
	low = 'Low',
	medium = 'Medium',
	urgent = 'Urgent'
}

export type PriorityProps = {
	value: string
	setValue: Dispatch<SetStateAction<Priority>>
}

const PriorityFilter: FC<PriorityProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	return (
		<FilterWrapper>
			<Title>Priority</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.priority.all')}
					value={value === Priority.all}
					onCheck={() => setValue(Priority.all)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.priority.low')}
					value={value === Priority.low}
					onCheck={() => setValue(Priority.low)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.priority.medium')}
					value={value === Priority.medium}
					onCheck={() => setValue(Priority.medium)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.priority.high')}
					value={value === Priority.high}
					onCheck={() => setValue(Priority.high)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.priority.urgent')}
					value={value === Priority.urgent}
					onCheck={() => setValue(Priority.urgent)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default PriorityFilter
