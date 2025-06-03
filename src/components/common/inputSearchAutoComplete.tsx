import { AnimatePresence, motion } from 'framer-motion'
import { Loader, LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { FieldError, UseFormRegister, UseFormSetValue } from 'react-hook-form'

import { IItemSuggestion } from '@/models/interfaces'

interface InputSearchAutoCompleteProps {
	name: string
	label: string
	placeholder?: string
	register: UseFormRegister<any>
	setValue: UseFormSetValue<any>
	error?: FieldError
	suggestions: IItemSuggestion[]
	isSuggestionsLoading: boolean
	onSelectSuggestion: (suggestion: IItemSuggestion | null) => void // Allow null for reset
	icon?: LucideIcon
	animationDelay?: number
	autocompleted?: 'off' | 'on'
}

const InputSearchAutoComplete: React.FC<InputSearchAutoCompleteProps> = ({
	name,
	label,
	placeholder,
	register,
	setValue,
	error,
	suggestions,
	isSuggestionsLoading,
	onSelectSuggestion,
	icon: Icon,
	animationDelay = 0.2,
	autocompleted = 'off'
}) => {
	const [showSuggestions, setShowSuggestions] = useState<boolean>(true)

	const commonClasses = `w-full px-4 py-3 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
		error
			? 'border-destructive bg-destructive/10'
			: 'border-border hover:border-border/80'
	}`

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value.trim()
		if (value) {
			const matchedSuggestion = suggestions.find(
				suggestion => suggestion.name.toLowerCase() === value.toLowerCase()
			)
			if (matchedSuggestion) {
				onSelectSuggestion(matchedSuggestion)
				setValue(name, matchedSuggestion.name)
			}
		}
		setShowSuggestions(false) // Always hide suggestions on blur
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: animationDelay, duration: 0.3 }}
		>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			<div className='relative'>
				{Icon && (
					<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
						<Icon className='text-foreground/50 h-5 w-5' />
					</div>
				)}
				<input
					type='search'
					{...register(name)}
					className={`${commonClasses} ${Icon ? 'pl-12' : 'pl-4'}`}
					placeholder={placeholder}
					autoComplete={autocompleted}
					onChange={e => {
						register(name).onChange(e)
						setValue(name, e.target.value)
						setShowSuggestions(true) // Show suggestions when typing
						onSelectSuggestion(null) // Reset suggestion state when editing
					}}
					onBlur={handleBlur}
				/>
				<AnimatePresence>
					{(isSuggestionsLoading ||
						(suggestions.length > 0 && showSuggestions)) && (
						<motion.ul
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className='border-border bg-card absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow-sm'
						>
							{isSuggestionsLoading ? (
								<li className='flex items-center justify-center px-3 py-2'>
									<Loader className='text-foreground/50 h-5 w-5 animate-spin' />
								</li>
							) : (
								suggestions.map(suggestion => (
									<li
										key={suggestion.id}
										onClick={() => {
											onSelectSuggestion(suggestion)
											setValue(name, suggestion.name)
											setShowSuggestions(false) // Hide suggestions after selection
										}}
										className='text-foreground hover:bg-muted cursor-pointer px-3 py-2'
									>
										{suggestion.name}
									</li>
								))
							)}
						</motion.ul>
					)}
				</AnimatePresence>
			</div>
			{error && (
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-destructive mt-1 text-sm'
				>
					{error.message}
				</motion.p>
			)}
		</motion.div>
	)
}

export default InputSearchAutoComplete
