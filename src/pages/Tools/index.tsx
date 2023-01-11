import Footer from 'components/HomeFooter'
import Placeholder from 'components/Placeholder'
import MainLayout from 'layout/MainLayout'
import React, { FC } from 'react'

const Tools: FC = () => {
	return (
		<MainLayout isChildWrapped={false}>
			<Placeholder>Tools</Placeholder>
			<Footer />
		</MainLayout>
	)
}

export default Tools
