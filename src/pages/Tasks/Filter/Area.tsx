import Tag from '@system/Tag'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { map } from 'lodash'
import { useAreasState } from 'providers/Areas'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export type AreaProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

const AreaFilter: FC<AreaProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	const { data } = useAreasState()

	return (
		<FilterWrapper isWrap>
			<Title>{t('filter.area.title')}:</Title>
			<CheckboxWrapper>
				<Tag
					label={t('filters.areasOrLocation.all')}
					value={value === ''}
					onCheck={() => setValue('')}
				/>
			</CheckboxWrapper>

			{map(data, ({ id, title }) => (
				<CheckboxWrapper key={id}>
					<Tag label={title} value={value === id} onCheck={() => setValue(id)} />
				</CheckboxWrapper>
			))}
		</FilterWrapper>
	)
}

export default AreaFilter
