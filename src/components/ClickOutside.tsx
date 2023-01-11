import React, { ReactNode, useEffect, useRef } from 'react'

export type ClickOutsideProps = {
	children: ReactNode
	onClickOutside: () => void
}

const useClickOutside = (ref: React.RefObject<HTMLButtonElement>, onClickOutside: () => void) => {
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside()
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [ref, onClickOutside])
}

const ClickOutside = ({ children, onClickOutside, ...rest }: ClickOutsideProps) => {
	const wrapperRef = useRef(null)
	useClickOutside(wrapperRef, onClickOutside)

	return (
		<div ref={wrapperRef} {...rest}>
			{children}
		</div>
	)
}

export default ClickOutside
