import Input from '@system/Input'
import { SearchWrapper, Wrapper } from 'components/FilterStyles'
import { FC } from 'react'
import HasSignupIssueFilter from './HasSignupIssue'
import RoleFilter from './Role'
import VerifiedFilter from './Verified'

export type LocationFilterProps = {
	issues: string
	role: string
	search: string
	verified: string
	setIssues: (props: any) => void
	setRole: (props: any) => void
	setSearch: (props: any) => void
	setVerified: (props: any) => void
}
const Filter: FC<LocationFilterProps> = ({
	issues,
	role,
	search,
	verified,
	setIssues,
	setRole,
	setSearch,
	setVerified
}) => {
	return (
		<Wrapper>
			<SearchWrapper>
				<Input
					hasClear
					isBlocked
					label='Search'
					placeholder='Type something'
					value={search}
					onChange={(e) => setSearch(e.currentTarget.value)}
					onClear={() => setSearch('')}
				/>
			</SearchWrapper>

			<RoleFilter value={role} setValue={setRole} />
			<VerifiedFilter value={verified} setValue={setVerified} />
			<HasSignupIssueFilter value={issues} setValue={setIssues} />
		</Wrapper>
	)
}

export default Filter
