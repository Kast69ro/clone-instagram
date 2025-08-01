// import { userId } from '@/api/pages/chat/utils/axios-reguest'
// import token from '@/api/pages/chat/utils/axios-reguest'
import axiosRequest from '@/lib/axiosRequest'
import { API } from '@/utils/config'
import axios from 'axios'
import { useState } from 'react'
import { create } from 'zustand'

export const useChat = create((set, get) => ({
	userProfile: [],
	allUsers: [],
	chatById: [],
	userByName: [],
	userByNameForSearch: [],
	lastMessages: {},
	myFollowers: [],
	getUserProfile: async id => {
		try {
			const { data } = await axiosRequest.get(
				`/UserProfile/get-user-profile-by-id?id=${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)

			set({ userProfile: data.data })
		} catch (error) {
			console.error(error)
		}
	},
	getAllUsers: async () => {
		try {
			const { data } = await axiosRequest.get(
				'/Chat/get-chats',
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			set({ allUsers: data.data })
		} catch (error) {
			console.error(error)
		}
	},
	getChatById: async user => {
		try {
			const { data } = await axiosRequest.get(
				'/Chat/get-chat-by-id?chatId=' + user,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			set({ chatById: data.data })
		} catch (error) {
			console.error(error)
		}
	},
	getUserByName: async userName => {
		try {
			const { data } = await axiosRequest.get(
				'/User/get-users?UserName=' + userName,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			set({ userByName: data.data[0] })
		} catch (error) {
			console.error(error)
		}
	},
	sendMessege: async formData => {
		try {
			await axiosRequest.put('/Chat/send-message', formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					'Content-Type': 'multipart/form-data',
				},
			})
			get().getChatById(formData.get('ChatId'))
		} catch (error) {
			console.error(error)
		}
	},
	delChatById: async id => {
		try {
			await axiosRequest.delete(
				'/Chat/delete-chat?chatId=' + id,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			get().getAllUsers()
		} catch (error) {
			console.error(error)
		}
	},
	delMessageById: async (chatId, id) => {
		try {
			await axiosRequest.delete(
				'/Chat/delete-message?massageId=' + chatId,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			get().getChatById(id)
		} catch (error) {
			console.error(error)
		}
	},
	getUserByNameForSearch: async name => {
		try {
			const { data } = await axiosRequest.get(
				'/User/get-users?UserName=' + name,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			set({ userByNameForSearch: data.data })
		} catch (error) {
			console.error(error)
		}
	},
	createChat: async id => {
		try {
			await axiosRequest.post(
				'/Chat/create-chat?receiverUserId=' + id,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('access_token')}`,
					},
				}
			)
			get().getAllUsers()
		} catch (error) {
			console.error(error)
		}
	},
	getLastMessages: async () => {
	try {
		const chatsRes = await axiosRequest.get(
			'/Chat/get-chats',
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
			}
		)

		const chats = chatsRes.data.data
		const map = {}

		await Promise.all(
			chats.map(async (chat) => {
				const res = await axios.get(
					`${API}/Chat/get-chat-by-id?chatId=${chat.chatId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem('access_token')}`,
						},
					}
				)

				let messages = res.data.data

				if (messages && messages.length > 0) {
					messages = messages.sort(
						(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
					)

					const lastMessage = messages[0] 
					map[chat.chatId] = lastMessage
				}
			})
		)

		set({ lastMessages: map })
	} catch (error) {
		console.error('Ошибка при получении последних сообщений:', error)
	}
   },
	getMyFollowers: async id => {
		try {
			const {data} = await axiosRequest.get('/FollowingRelationShip/get-subscribers?UserId=' + id, {
				headers: {
					"Authorization": `Bearer ${localStorage.getItem('access_token')}`
				}
			})
			set({myFollowers: data.data})
		} catch (error) {
			console.error(error);
		}
	}
}))