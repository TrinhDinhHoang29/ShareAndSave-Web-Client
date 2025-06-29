import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import settingApi from '@/apis/modules/setting.api'
import { ESettingKey } from '@/models/enums'
import { ISetting } from '@/models/interfaces'

interface SettingsState {
	settings: ISetting[]
	isLoading: boolean
	error: string | null
	fetchSettings: () => Promise<void>
	getSettingValue: (key: string) => string | undefined
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, get) => ({
			settings: [],
			isLoading: false,
			error: null,
			fetchSettings: async () => {
				if (get().settings.length > 0) {
					return // Skip API call if settings exist
				}
				set({ isLoading: true, error: null })
				try {
					const response = await settingApi.getAllSettings()
					set({ settings: response.data.settings, isLoading: false })
				} catch (error: any) {
					set({
						error: error.message || 'Failed to fetch settings',
						isLoading: false
					})
				}
			},
			getSettingValue: (key: string) => {
				return get().settings.find(
					setting => setting.key === (key as ESettingKey)
				)?.value
			}
		}),
		{
			name: 'settings-storage', // Key for localStorage
			storage: createJSONStorage(() => localStorage) // Use localStorage for persistence
		}
	)
)
