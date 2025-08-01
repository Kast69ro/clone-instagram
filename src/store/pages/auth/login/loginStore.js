import axiosRequest from '@/lib/axiosRequest'
import { FireTruck } from '@mui/icons-material'
import { create } from 'zustand'

export const useLoginStore = create((set, get) => ({
	loading: false,
	wrong: false,
	login: async (form, router) => {
		set({
			loading: true,
			wrong: false,
		})
		try {
			let response = await axiosRequest.post('/Account/login', form)
			localStorage.setItem('access_token', response.data.data)
			router.push('/')
			set({
				loading: false,
				wrong: false,
			})
		} catch (error) {
			console.log(error)
			set({
				loading: false,
				wrong: true,
			})
		}
	},
}))
