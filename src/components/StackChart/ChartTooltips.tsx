import { ReactComponent as CheckIcon } from 'icons/check.svg'
import { ReactComponent as TimesIcon } from 'icons/times.svg'
import { each, filter, map, reduce, reverse } from 'lodash'
import { transparentize } from 'polished'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components/macro'

export type ChartTooltipProps = {
	active?: boolean
	payload: any
	target: number
}

const ChartTooltip: FC<ChartTooltipProps> = ({ active, payload, target }) => {
	const { t } = useTranslation('common')
	const SIX_SIGMA = [
		t('6s.s1'),
		t('6s.s2'),
		t('6s.s3'),
		t('6s.s4'),
		t('6s.s5'),
		t('6s.s6')
	]

	const getScore = (data: any): number => {
		return reduce(data, (prev, current) => {
			if (typeof prev === 'object') {
				return parseFloat(prev.value) + parseFloat(current.value)
			}

			return prev + parseFloat(current.value)
		})
	}

	const score = useMemo(() => getScore([...payload]), [payload])

	const isPlaceholder = () => {
		let total = 0
		each(payload, (value) => {
			const valueKeys = Object.keys(value?.payload)
			const filteredKeys = filter(valueKeys, (key) => {
				return key.charAt(0) === 's'
			})

			const mappedFilteredKeys = map(filteredKeys, (key) => {
				return value?.payload[key]
			})
			total = reduce(mappedFilteredKeys, (prev, curr) => {
				return prev + curr
			})
		})

		return total <= 0
	}

	if (active && payload && payload.length && !isPlaceholder()) {
		return (
			<Wrapper>
				<Header>
					<Title>{t('stackChart.results')}</Title>
					{target <= score ? (
						<ResultIcon isChecked>
							<CheckIcon />
						</ResultIcon>
					) : (
						<ResultIcon>
							<TimesIcon />
						</ResultIcon>
					)}
				</Header>
				{map(reverse([...payload]), (item: any, index: number) => {
					return (
						<Data key={index}>
							<Name>
								<NameAbbr color={item.fill}>{item.name}</NameAbbr>{' '}
								<NameText> - {SIX_SIGMA[parseInt(item.name.charAt(1)) - 1]}</NameText>
							</Name>
							<Value>{item.value}</Value>
						</Data>
					)
				})}
				<Score>
					<ScoreText>{t('stackChart.totalScore')}</ScoreText>
					<Value>{score}</Value>
				</Score>
			</Wrapper>
		)
	}

	return null
}

const Wrapper = styled.div`
	background: ${(props) => transparentize(0.05, props.theme.colors.neutral002)};
	border-radius: ${(props) => props.theme.radius.medium};
	padding: 30px;
`
const Header = styled.div`
	align-items: baseline;
	background: transparent;
	display: flex;
	margin-bottom: 20px;
`

const Title = styled.h4`
	color: ${(props) => props.theme.colors.neutral001};
	font-size: ${(props) => props.theme.font.sizes.medium};
	margin-right: auto;
`

const ResultIcon = styled.div<{ isChecked?: boolean }>`
	align-items: center;
	background: ${(props) =>
		props.isChecked ? props.theme.colors.success : props.theme.colors.danger};
	border-radius: 30px;
	color: #fff;
	display: flex;
	height: 30px;
	justify-content: center;
	margin-right: -10px;
	width: 30px;
`

const Data = styled.div`
	background: transparent;
	display: flex;
`

const Name = styled.div`
	flex: 1;
	margin-right: 20px;
	margin-bottom: 10px;
`

const NameAbbr = styled.span<{ color?: string }>`
	color: ${(props) => (props.color ? props.color : props.theme.colors.neutral004)};
	font-size: ${(props) => props.theme.font.sizes.normal};
	font-weight: 700;
	text-transform: capitalize;
`
const NameText = styled.span`
	color: ${(props) => props.theme.colors.neutral004};
	font-size: ${(props) => props.theme.font.sizes.normal};
	letter-spacing: 0.08em;
`

const Value = styled.span`
	color: ${(props) => props.theme.colors.neutral004};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 700;
`

const Score = styled.div`
	background: transparent;
	display: flex;
	margin-top: 10px;
`

const ScoreText = styled.span`
	color: ${(props) => props.theme.colors.neutral004};
	font-size: ${(props) => props.theme.font.sizes.medium};
	font-weight: 700;
	flex: 1;
`

export default ChartTooltip
