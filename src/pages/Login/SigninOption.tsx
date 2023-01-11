import Button from '@system/Button'
import { Darken, OptionWrapper } from 'components/EntryStyles'
import { ReactComponent as ArrowBackwardIcon } from 'icons/arrowBackward.svg'
import { ReactComponent as FacebookIcon } from 'icons/facebook.svg'
import { ReactComponent as GoogleIcon } from 'icons/google.svg'
import React, { FC } from 'react'

export type SigninOptionProps = {
	setIsOptionsOpen: (isOpen: boolean) => void
}

const SigninOption: FC<SigninOptionProps> = ({ setIsOptionsOpen }) => {
	return (
		<OptionWrapper>
			<Button isBlocked={true} to='/signup'>
				<FacebookIcon /> continue with Facebook
			</Button>

			<Button variant='danger' isBlocked={true} to='/signup'>
				<GoogleIcon /> continue with Google
			</Button>

			<Button isBlocked={true} variant='ghost' onClick={() => setIsOptionsOpen(false)}>
				<ArrowBackwardIcon /> Login using email
			</Button>

			<Button isBlocked={true} variant='ghost' to='/signup'>
				<Darken>Don't have an account?</Darken>Join now.
			</Button>
		</OptionWrapper>
	)
}

export default SigninOption
