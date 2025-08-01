'use client'
import { api, userId } from '@/api/pages/chat/utils/axios-reguest'
import DefaultChatComponent from '@/components/pages/chat/pages/default-chat/default-chat'
import { useChat } from '@/store/pages/chat/pages/default-chat/default-chat'
import { MessageCircleHeart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DefaultChat() {
	const [modal, setModal] = useState(false)
	const { myFollowers, getMyFollowers, createChat } = useChat()
	const [search, setSearch] = useState('')

	function handleCreateChat(id){
		createChat(id)
		setModal(false)
		setSearch('')
	}

	useEffect(() => {
		getMyFollowers(userId.sid)
	}, [])

	return (
		<section className='w-[100%] h-[100vh] flex'>
			<aside className='lg:w-[30%] w-[97%]'>
				<DefaultChatComponent></DefaultChatComponent>
			</aside>
			<aside className='w-[70%] hidden lg:flex flex-col items-center justify-center gap-[10px]'>
				<div className='border-4 border-[black] rounded-[50%] p-[15px]'>
					<MessageCircleHeart className='w-[55px] h-[55px]' />
				</div>
				<b className='text-[20px]'>Ваши сообщения</b>
				<p className='text-[gray]'>
					Отправляйте личные фото и сообщения другу или группе
				</p>
				<button
					className='bg-sky-600 text-[white] px-[15px] py-[5px] rounded-[10px]'
					onClick={() => setModal(true)}
				>
					Отправить сообщение
				</button>
			</aside>
			{modal && (
				<div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50 flex items-center justify-center z-50'>
					<div className='w-full max-w-md h-[70vh] bg-white rounded-xl shadow-xl flex flex-col relative'>
						<div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
							<h2 className='text-lg font-semibold text-gray-800 w-full text-center'>
								Новое сообщение
							</h2>
							<button
								onClick={() => setModal(false)}
								className='absolute cursor-pointer right-4 top-3 text-gray-500 hover:text-black text-xl'
							>
								×
							</button>
						</div>

						<div className='px-4 py-2 border-b border-gray-200 flex items-center gap-2'>
							<span className='text-sm text-gray-600'>Кому:</span>
							<input
								type='text'
								placeholder='Поиск...'
								className='flex-1 text-sm outline-none bg-transparent placeholder-gray-400'
								value={search}
								onChange={e => setSearch(e.target.value)}
							/>
						</div>

						<div className='flex-1 overflow-y-auto px-4 py-3 space-y-1'>
							{myFollowers
								.filter(el =>
									el.userShortInfo?.userName
										.toLowerCase()
										.includes(search.toLowerCase())
								)
								?.map(el => (
									<div
										key={el.id}
										className='flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer'
										onClick={() => handleCreateChat(el.userShortInfo.userId)}
									>
										<img
											src={api + 'images/' + el.userShortInfo?.userPhoto}
											alt='userPhoto'
											className='w-11 h-11 rounded-full object-cover bg-gray-200'
										/>
										<span className='text-sm text-gray-800 font-medium'>
											{el.userShortInfo?.userName}
										</span>
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</section>
	)
}
