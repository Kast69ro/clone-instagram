import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useDrawerStore = create((set, get) => ({
	datas: [],
	history: [],
	isOpen: false,
	loading: false,
	openDrawer: () => set({ isOpen: true }),
	closeDrawer: () => set({ isOpen: false }),
	toggleDrawer: () => set(state => ({ isOpen: !state.isOpen })),

	searchUser: async user => {
		set({ loading: true })
		try {
			let { data } = await axiosRequest(
				`/User/get-users?UserName=${user !== '' ? user : ''}`
			)

			set(() => ({ datas: data.data, loading: false }))
		} catch (error) {
			console.log(error)
			set({ loading: false })
		}
	},

	postSearchHistory: async id => {
		try {
			await axiosRequest.post(
				`/User/add-user-search-history?UserSearchId=${id}`
			)
		} catch (error) {
			console.log(error)
		}
	},

	getSearchHistory: async () => {
		set({ loding: true })
		try {
			let { data } = await axiosRequest.get('/User/get-user-search-histories')
			// console.log('history:', data.data)
			set(() => ({ history: data.data, loading: false }))
		} catch (error) {
			console.log(error)
			set({ loading: false })
		}
	},

	deleteSearchHistory: async id => {
		try {
			await axiosRequest.delete(`/User/delete-user-search-history?id=${id}`)
			get().getSearchHistory()
		} catch (error) {
			console.log(error)
		}
	},

	clearSearchHistory: async () => {
		try {
			await axiosRequest.delete('/User/delete-user-search-histories')
			get().getSearchHistory()
		} catch (error) {
			console.log(error)
		}
	},
}))
