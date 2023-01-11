import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'

export enum Role {
	all = '',
	admin = '1',
	user = '2'
}

export type RoleProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

const RoleFilter: FC<RoleProps> = ({ value, setValue }) => {
	return (
		<FilterWrapper>
			<Title>Role</Title>
			<CheckboxWrapper>
				<Checkbox
					label='All'
					value={value === Role.all}
					onCheck={() => setValue(Role.all)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='Admin'
					value={value === Role.admin}
					onCheck={() => setValue(Role.admin)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='User'
					value={value === Role.user}
					onCheck={() => setValue(Role.user)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default RoleFilter
