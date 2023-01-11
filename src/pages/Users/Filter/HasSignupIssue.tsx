import Checkbox from '@system/Checkbox'
import { CheckboxWrapper, FilterWrapper, Title } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'

export type RoleProps = {
	value: string
	setValue: Dispatch<SetStateAction<string>>
}

export enum signupIssue {
	all = 'all',
	hasSignupIssue = '1',
	hasNoSignupIssue = '0'
}

const HasSignupIssueFilter: FC<RoleProps> = ({ value, setValue }) => {
	return (
		<FilterWrapper>
			<Title>Issue</Title>
			<CheckboxWrapper>
				<Checkbox
					label='All'
					value={value === signupIssue.all}
					onCheck={() => setValue(signupIssue.all)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='Has issue'
					value={value === signupIssue.hasSignupIssue}
					onCheck={() => setValue(signupIssue.hasSignupIssue)}
				/>
			</CheckboxWrapper>
			<CheckboxWrapper>
				<Checkbox
					label='No issue'
					value={value === signupIssue.hasNoSignupIssue}
					onCheck={() => setValue(signupIssue.hasNoSignupIssue)}
				/>
			</CheckboxWrapper>
		</FilterWrapper>
	)
}

export default HasSignupIssueFilter
