import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { map } from 'lodash'
import { useLocationsState } from 'providers/Locations'
import { useFetchLocation } from 'providers/Locations/useFetchLocation'
import React, { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

export type LocationProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

const LocationFilter: FC<LocationProps> = ({ value, setValue }) => {
	const { t } = useTranslation('common')
	const { data } = useLocationsState()

	useFetchLocation()

	return (
		<FilterWrapper>
			<Title>{t('locations.title')}</Title>
			<CheckboxWrapper>
				<Checkbox
					label={t('filters.areasOrLocation.all')}
					value={value === ''}
					onCheck={() => setValue('')}
				/>
			</CheckboxWrapper>
			{map(data, ({ id, name }) => (
				<CheckboxWrapper key={id}>
					<Checkbox label={name} value={value === id} onCheck={() => setValue(id)} />
				</CheckboxWrapper>
			))}
		</FilterWrapper>
	)
}

export default LocationFilter
