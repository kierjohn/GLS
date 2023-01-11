import { map } from 'lodash';
import { useMeState } from 'providers/Me';
import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Payload } from 'recharts/types/component/DefaultLegendContent';
import styled from 'styled-components/macro';
import theme from 'theme';

export type ChartLegendProps = {
	payload?: Payload[];
};

const ChartLegend: FC<ChartLegendProps> = memo(({ payload }) => {
	const { t } = useTranslation('common');
	const { theme: th } = useMeState();
	return (
		<Wrapper>
			<Items>
				{map(payload, (item, index) => (
					<Item key={index}>
						<LegendIcon color={item.color ? item.color : ''}></LegendIcon>
						<LegendAbbr>{item.value}</LegendAbbr>
					</Item>
				))}

				<Item>
					<Legend color={theme(th).colors.success}></Legend>
					<Text>{t('stackChart.targetScore')}</Text>
				</Item>
			</Items>
		</Wrapper>
	);
});

const Wrapper = styled.div`
	background: none;
	display: flex;
	justify-content: center;
	padding: 0;
	position: relative;
	width: 100%;
	padding-top: 20px;
	@media screen and (min-width: 768px) {
		padding: 30px 20px 20px 20px;
	}
`;

const Items = styled.ul`
	display: flex;
	flex-wrap: wrap;
	list-style-type: none;
	margin: 0;
	padding: 0;
`;

const Item = styled.li<{ isHidden?: boolean }>`
	align-items: center;
	cursor: pointer;
	display: flex;
	opacity: ${(props) => (props.isHidden ? 0.25 : 1)};
	padding: 5px 10px;
	flex: 1;
	&:hover {
		opacity: 0.5;
	}
	@media screen and (min-width: 768px) {
		padding: 5px 15px;
		flex: 0;
	}
`;

const LegendIcon = styled.span<{ color: string }>`
	background: ${(props) => props.color};
	border-radius: 3px;
	display: flex;
	height: 10px;
	margin-right: 5px;
	width: 10px;
`;

const LegendAbbr = styled.span`
	color: ${(props) => props.theme.colors.neutral000};
	font-weight: 600;
	text-transform: uppercase;
`;

const Text = styled.span`
	color: ${(props) => props.theme.colors.neutral000};
	font-weight: 600;
	white-space: nowrap;
`;

const Legend = styled.span`
	border-bottom: 3px dashed ${(props) => props.color};
	display: flex;
	margin-right: 5px;
	width: 15px;
`;
export default ChartLegend;
