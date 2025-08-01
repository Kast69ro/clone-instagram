import axiosRequest from '@/lib/axiosRequest'
import { create } from 'zustand'

export const useRegistration = create((set, get) => ({
	loading: false,
	wrong: false,
	registrate: async (form, router) => {
		set({
			loading: true,
		})
		try {
			await axiosRequest.post(`/Account/register`, form)
			router.push('/login')
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
