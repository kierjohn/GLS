import Button from '@system/Button'
import Input from '@system/Input'
import { SearchWrapper, Wrapper } from 'components/FilterStyles'
import { Dispatch, FC, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import SortByFilter from './SortBy'
import SortDirectionFilter from './SortDirection'
import TypeFilter from './Type'

export type AreasFilterProps = {
	order: string
	search: string
	sort: string
	type: string
	setOrder: (props: any) => void
	setSearch: (props: any) => void
	setSort: Dispatch<SetStateAction<string>>
	setType: (props: any) => void
}
const Filter: FC<AreasFilterProps> = ({
	order,
	search,
	sort,
	type,
	setOrder,
	setSort,
	setSearch,
	setType
}) => {
	const { t } = useTranslation('common')

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
			<TypeFilter value={type} setValue={setType} />
			{order === 'desc' &&
			sort === 'createdAt' &&
			type === 'all' &&
			search.length === 0 ? (
				<></>
			) : (
				<Button
					onClick={() => {
						setOrder('desc')
						setSearch('')
						setSort('createdAt')
						setType('all')
					}}
					isBlocked>
					{t('filter.reset')}
				</Button>
			)}
		</Wrapper>
	)
}

export default Filter
