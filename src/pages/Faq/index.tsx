import H from '@system/H'
import Footer from 'components/HomeFooter'
import MainLayout from 'layout/MainLayout'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import Item from './item'
import data from './data.json'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
const FAQ = () => {
	const { t } = useTranslation('common')
	const [openItem, setOpenItem] = useState<string | null>(null)

	return (
		<MainLayout isChildWrapped={false}>
			<Helmet>
				<title>Faq</title>
			</Helmet>
			<Wrapper>
				<H as='h1'>Frequently ask questions</H>
				<FAQWrapper>
					{map(data, ({ id, answer, question }) => (
						<Item
							id={id}
							answer={t(answer)}
							isOpen={openItem === id}
							question={t(question)}
							setIsOpen={setOpenItem}
						/>
					))}
				</FAQWrapper>
			</Wrapper>
			<Footer />
		</MainLayout>
	)
}

const Wrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	margin-top: 40px;
	width: 100%;
	height: 100%;
	padding: 10px;
`

const FAQWrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-top: 40px;
`

export default FAQ
