import Button from '@system/Button'
import Input from '@system/Input'
import { SearchWrapper, Wrapper } from 'components/FilterStyles'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ArchivedFilter from './Archived'
import PriorityFilter from './Priority'

export type TasksFilterTypes = {
	archived: boolean
	area: string
	location: string
	priority: string
	search: string
	setArchived: (props: any) => void
	setArea: (props: any) => void
	setLocation: (props: any) => void
	setPriority: (props: any) => void
	setSearch: (props: any) => void
}

const Filter: FC<TasksFilterTypes> = ({
	archived,
	location,
	priority,
	search,
	setArchived,
	setLocation,
	setPriority,
	setSearch
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
			<PriorityFilter value={priority} setValue={setPriority} />
			<ArchivedFilter value={archived} setValue={setArchived} />
			{(location || priority || search || archived) && (
				<Button
					onClick={() => {
						setLocation('')
						setPriority('')
						setSearch('')
						setArchived(false)
					}}
					isBlocked>
					{t('filter.reset')}
				</Button>
			)}
		</Wrapper>
	)
}

export default Filter
