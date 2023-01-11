import { Wrapper } from 'components/FilterStyles'
import { ReactComponent as BackIcon } from 'icons/back.svg'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components/macro'
import HasDeviationFilter from './HasDeviation'

export type AuditFilterProps = {
	hasDeviation: number
	setHasDeviation: (props: any) => void
}
const Filter: FC<AuditFilterProps> = ({ hasDeviation, setHasDeviation }) => {
	const navigate = useNavigate()

	return (
		<Wrapper>
			<Back onClick={() => navigate('/audits')}>
				<BackIcon /> Audits
			</Back>
			<HasDeviationFilter value={hasDeviation} setValue={setHasDeviation} />
		</Wrapper>
	)
}

const Back = styled.div`
	display: flex;
	color: ${(props) => props.theme.colors.primary};
	align-items: center;
	margin-bottom: 40px;
	font-weight: 700;
	cursor: pointer;
	&:hover {
		opacity: 0.75;
	}

	&:active {
		opacity: 0.5;
	}

	& > :first-child {
		margin-right: 10px;
	}
`

export default Filter
