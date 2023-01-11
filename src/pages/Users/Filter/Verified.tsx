import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'

export type RoleProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

export enum verified {
	all = 'all',
	verified = '1',
	notVerified = '0'
}

const VerifiedFilter: FC<RoleProps> = ({ value, setValue }) => {
	return (
		<FilterWrapper>
			<Title>Verified</Title>
			<CheckboxWrapper>
				<Checkbox
					label='All'
					value={value === verified.all}
					onCheck={() => setValue(verified.all)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='Verified'
					value={value === verified.verified}
					onCheck={() => setValue(verified.verified)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='Not verified'
					value={value === verified.notVerified}
					onCheck={() => setValue(verified.notVerified)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default VerifiedFilter
