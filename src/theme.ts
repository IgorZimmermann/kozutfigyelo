import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = {
	mono: `'Menlo', monospace`,
}

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '52em',
	lg: '64em',
	xl: '80em',
})

const theme = extendTheme({
	colors: {
		lgrey: '#7C7C7C',
		grey: '#2C2C2C',
	},
	breakpoints,
	fonts,
})

export default theme
