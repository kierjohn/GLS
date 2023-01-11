import { ReactComponent as SpinnerIcon } from 'icons/spinner.svg'
import { transparentize } from 'polished'
import { FC, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, DefaultTheme, keyframes, ThemeProps } from 'styled-components/macro'

export type ButtonProps = {
	disabled?: boolean
	hasPadding?: boolean
	isBlocked?: boolean
	loading?: boolean
	size?: 'small' | 'normal' | 'medium' | 'large'
	to?: string
	type?: 'button' | 'submit' | 'reset'
	variant?:
		| 'primary'
		| 'light'
		| 'link'
		| 'link-light'
		| 'ghost'
		| 'ghost-light'
		| 'danger'
		| 'danger-ghost'
	width?: string
	onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const Button: FC<ButtonProps> = ({
	children,
	disabled,
	hasPadding = true,
	isBlocked = false,
	loading,
	size = 'normal',
	to = '',
	type = 'button',
	variant = 'primary',
	width = 'fit-content',
	onClick,
	...rest
}) => {
	if (Boolean(to?.trim())) {
		return (
			<WrapperLink
				$hasPadding={hasPadding}
				$isBlocked={isBlocked}
				$size={size}
				to={to}
				$variant={variant}
				$width={width}
				{...rest}>
				{loading ? (
					<Spinner>
						<SpinnerIcon />
					</Spinner>
				) : (
					children
				)}
			</WrapperLink>
		)
	}

	return (
		<Wrapper
			$hasPadding={hasPadding}
			$isBlocked={isBlocked}
			disabled={disabled || loading}
			$size={size}
			type={type}
			onClick={onClick}
			$variant={variant}
			$width={width}
			{...rest}>
			{loading ? (
				<Spinner>
					<SpinnerIcon />
				</Spinner>
			) : (
				children
			)}
		</Wrapper>
	)
}

const wrapperStyle = (
	props: ThemeProps<DefaultTheme> & {
		$hasPadding: boolean
		$isBlocked: boolean
		$size: string
		$variant: string
		$width: string
	}
) => {
	return css`
		align-items: center;
		border-radius: 3px;
		cursor: pointer;
		display: flex;
		font-family: ${(props) => props.theme.font.family.header};
		font-size: ${props.theme.font.sizes.normal};
		font-weight: 600;
		justify-content: center;
		padding: ${props.$hasPadding ? '12px 24px 10px' : '0 5px'};
		position: relative;
		text-align: center;
		text-decoration: none;
		transition: all 250ms cubic-bezier(1, 0, 0, 1);
		user-select: none;
		white-space: nowrap;
		&:hover {
			opacity: 0.8;
		}

		&:active {
			opacity: 0.6;
		}
		& > * {
			margin: 0 5px 0 0;
			background: transparent;
		}

		& > svg {
			height: 16px;
		}
		${() => {
			switch (props.$variant) {
				case 'primary':
					return css`
						background: ${props.theme.colors.primary};
						color: #e6ecf1;
					`
				case 'light':
					return css`
						background: ${props.theme.colors.neutral006};
						color: ${props.theme.colors.neutral000};
					`
				case 'danger':
					return css`
						background: ${props.theme.colors.danger};
						color: #e6ecf1;
					`
				case 'ghost':
					return css`
						background: ${transparentize(0.9, props.theme.colors.primary)};
						color: ${props.theme.colors.primary};
						&:hover {
							background: ${(props) => props.theme.colors.neutral006};
						}
					`
				case 'link':
					return css`
						background: transparent;
						color: ${props.theme.colors.primary};
						&:hover {
							background: ${(props) => props.theme.colors.neutral006};
						}
					`
				case 'link-light':
					return css`
						background: transparent;
						color: ${props.theme.colors.neutral000};
						&:hover {
							background: ${(props) => props.theme.colors.neutral006};
						}
					`
				case 'ghost-light':
					return css`
						background: ${transparentize(0.9, props.theme.colors.neutral000)};
						color: ${props.theme.colors.neutral000};
					`
				case 'danger-light':
					return css`
						background: transparent;
						color: ${props.theme.colors.danger};
					`
				case 'danger-ghost':
					return css`
						background: ${transparentize(0.9, props.theme.colors.danger)};
						color: ${props.theme.colors.danger};
					`
			}
		}}

		${() => {
			switch (props.$size) {
				case 'medium':
					return css`
						height: ${props.$hasPadding ? '55px' : '30px'};
					`
				case 'large':
					return css`
						height: ${props.$hasPadding ? '60px' : '30px'};
						padding: ${props.$hasPadding ? '10px 40px' : '0 5px'};
					`
				case 'small':
					return css`
						height: ${props.$hasPadding ? '40px' : '30px'};
						padding: ${props.$hasPadding ? '10px 20px' : '0 5px'};
					`
				default:
					return css`
						height: ${props.$hasPadding ? '50px' : '30px'};
					`
			}
		}};
		width: ${props.$isBlocked ? '100%' : props.$width};

		&:disabled {
			background-color: ${(props) => props.theme.colors.neutral006};
			color: ${(props) => props.theme.colors.neutral003};
		}
	`
}

const Wrapper = styled.button<{
	$hasPadding: boolean
	$isBlocked: boolean
	$size: string
	$variant: string
	$width: string
}>`
	${(props) => wrapperStyle(props)}
`

const WrapperLink = styled(Link)<{
	$hasPadding: boolean
	$isBlocked: boolean
	$size: string
	$variant: string
	$width: string
}>`
	${(props) => wrapperStyle(props)}
`

const spin = keyframes`
	from {
		transform: rotate(0deg)
	}
	to {
		transform: rotate(360deg)
	}
`

const Spinner = styled.span`
	& > svg {
		animation: 250ms linear infinite ${spin};
	}
`

export default Button
