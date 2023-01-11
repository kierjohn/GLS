import { map } from 'lodash'
import React, { FC, memo, useCallback } from 'react'
import GhostItem from './Item'

export type GhostLoaderProps = {
	dataCount: number
	isSmall?: boolean
	itemCount: number
	min: number
	max: number
}

const GhostLoader: FC<GhostLoaderProps> = memo(
	({ dataCount, isSmall = false, itemCount, max, min }) => {
		const getRandomInt = useCallback(() => {
			return Math.random() * (max - min + 1) + min
		}, [min, max])

		return (
			<>
				{map(Array.from(Array(itemCount).keys()), (item) => {
					return (
						<GhostItem
							isSmall={isSmall}
							key={item}
							format={[
								{
									isBlocked: true,
									valueWidth: getRandomInt(),
									labelWidth: getRandomInt()
								},
								...map(Array.from(Array(dataCount - 1).keys()), (data) => {
									return {
										isBlocked: false,
										valueWidth: getRandomInt(),
										labelWidth: getRandomInt()
									}
								})
							]}></GhostItem>
					)
				})}
			</>
		)
	}
)

export default GhostLoader
