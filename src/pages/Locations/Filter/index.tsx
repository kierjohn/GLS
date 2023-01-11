import Input from '@system/Input'
import { SearchWrapper, Wrapper } from 'components/FilterStyles'
import React, { Dispatch, FC, SetStateAction } from 'react'
import SortByFilter from './SortBy'
import SortDirectionFilter from './SortDirection'

export type LocationFilterProps = {
	order: string
	search: string
	sort: string
	setOrder: (props: any) => void
	setSearch: (props: any) => void
	setSort: Dispatch<SetStateAction<string>>
}
const Filter: FC<LocationFilterProps> = ({
	order,
	search,
	sort,
	setOrder,
	setSort,
	setSearch
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

			<SortByFilter value={sort} setValue={setSort} />
			<SortDirectionFilter value={order} setValue={setOrder} />
		</Wrapper>
	)
}

export default Filter
