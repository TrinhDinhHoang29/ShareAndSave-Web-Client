import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface PaginationState {
	pagination: Record<
		string,
		{
			currentPage: number
			itemsPerPage: number
			totalPages: number
		}
	>
	setPage: (pageId: string, page: number) => void
	setTotalPages: (pageId: string, totalPages: number) => void
	resetPagination: (pageId: string) => void
}

const usePaginationStore = create<PaginationState>()(
	subscribeWithSelector(set => ({
		pagination: {},
		setPage: (pageId, page) =>
			set(state => {
				const current = state.pagination[pageId] || {
					currentPage: 1,
					itemsPerPage: 6,
					totalPages: 1
				}
				const newPage = Math.max(1, Math.min(page, current.totalPages))
				if (current.currentPage === newPage) return state
				return {
					pagination: {
						...state.pagination,
						[pageId]: { ...current, currentPage: newPage }
					}
				}
			}),
		setTotalPages: (pageId, totalPages) =>
			set(state => {
				const current = state.pagination[pageId] || {
					currentPage: 1,
					itemsPerPage: 6,
					totalPages: 1
				}
				const newTotalPages = Math.max(1, totalPages)
				if (current.totalPages === newTotalPages) return state
				const newCurrentPage = Math.min(current.currentPage, newTotalPages)
				return {
					pagination: {
						...state.pagination,
						[pageId]: {
							...current,
							totalPages: newTotalPages,
							currentPage: newCurrentPage
						}
					}
				}
			}),
		resetPagination: pageId =>
			set(state => {
				const current = state.pagination[pageId]
				if (current?.currentPage === 1 && current?.totalPages === 1)
					return state
				return {
					pagination: {
						...state.pagination,
						[pageId]: { currentPage: 1, itemsPerPage: 6, totalPages: 1 }
					}
				}
			})
	}))
)

export default usePaginationStore
