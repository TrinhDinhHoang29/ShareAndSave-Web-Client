import { createContext, useContext, useState } from 'react'

interface FontProviderProps {
	children: React.ReactNode
}

interface FontProviderState {
	font: string
	setFont: (font: string) => void
}

const initialState: FontProviderState = {
	font: 'Inter',
	setFont: () => null
}

const FontProviderContext = createContext<FontProviderState>(initialState)

export function FontProvider({ children }: FontProviderProps) {
	const [font, setFont] = useState('Inter')

	const value = {
		font,
		setFont
	}

	return (
		<FontProviderContext.Provider value={value}>
			{children}
		</FontProviderContext.Provider>
	)
}

export const useFont = () => {
	const context = useContext(FontProviderContext)
	if (context === undefined)
		throw new Error('useFont must be used within a FontProvider')
	return context
}
