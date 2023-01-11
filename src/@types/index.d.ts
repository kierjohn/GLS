export {}

declare global {
	interface Window {
		html2canvas: (
			element: HTMLElement,
			options?: Partial<Options>
		) => Promise<HTMLCanvasElement>
		canvg: any
	}
}
