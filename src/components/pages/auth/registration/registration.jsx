

'use client'

import phones from '@/assets/img/pages/auth/registration/instt.jpg'
import google_play from '@/assets/img/pages/auth/registration/google_play.png'
import microsoft from '@/assets/img/pages/auth/registration/microsoft.png'
import inst_logo_auth from '@/assets/img/pages/auth/registration/inst_logo_auth.png'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import { useRegistration } from '@/store/pages/auth/registration/registrationStore'
import { useRouter } from 'next/navigation'

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { CircularProgress } from '@mui/material'


export default function RegisttrationComp() {
	const { registrate, loading, wrong } = useRegistration()
	const router = useRouter()

	const [email, setEmail] = useState('')
	const [userName, setUserName] = useState('')
	const [fullName, setFullName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

	async function handleRegist(e) {
		e.preventDefault()
		const user = {
			userName: e.target.userName.value,
			fullName: e.target.fullName.value,
			email: e.target.email.value,
			password: e.target.password.value,
			confirmPassword: e.target.confirmPassword.value,
		}
		try {
			await registrate(user, router)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<section className='min-h-screen flex flex-col md:flex-row md:justify-around items-center justify-center p-6 gap-10'>
			<aside className='hidden md:block'>
				<Image src={phones} alt='phones' className='w-[400px]' />
				<div className='mt-4 text-center'>
					<p className='text-sm text-gray-600 mb-2'>Установите приложение</p>
					<div className='flex justify-center items-center gap-4'>
						<Link href='https://play.google.com/store/apps/details?id=com.instagram.android&hl=ru' target='_blank'>
							<Image src={google_play} alt='google_play' className='w-35' />
						</Link>
						<Link href='https://apps.microsoft.com/detail/9nblggh5l9xt?hl=ru-RU&gl=RU' target='_blank'>
							<Image src={microsoft} alt='microsoft' className='w-30 h-[40px]' />
						</Link>
					</div>
				</div>
			</aside>

			<aside className='w-full max-w-sm'>
				<div className='bg-white rounded-xl shadow-lg p-8'>
					<div className='flex justify-center mb-6'>
						<Image src={inst_logo_auth} alt='inst_logo_auth' className='w-36' />
					</div>

					<form onSubmit={handleRegist} className='space-y-4'>
						<input
							required
							type='email'
							name='email'
							placeholder='Email'
							className='input-style'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
						<input
							required
							type='text'
							name='fullName'
							placeholder='Full name'
							className='input-style'
							value={fullName}
							onChange={e => setFullName(e.target.value)}
						/>
						<input
							required
							type='text'
							name='userName'
							placeholder='Username'
							className='input-style'
							value={userName}
							onChange={e => setUserName(e.target.value)}
						/>
						<div className='relative'>
							<input
								required
								type={showPassword ? 'text' : 'password'}
								name='password'
								placeholder='Password'
								className='input-style pr-10'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
							<span
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-3 cursor-pointer text-gray-400 text-sm'
							>
								{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</span>
						</div>
						<div className='relative'>
							<input
								required
								type={showConfirm ? 'text' : 'password'}
								name='confirmPassword'
								placeholder='Confirm Password'
								className='input-style pr-10'
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
							/>
							<span
								onClick={() => setShowConfirm(!showConfirm)}
								className='absolute right-3 top-3 cursor-pointer text-gray-400 text-sm'
							>
								{showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
							</span>
						</div>

						<p className='text-xs text-gray-500 text-center leading-5'>
							By signing up, you agree to our{' '}
							<span className='font-medium text-gray-700'>Terms</span>,{' '}
							<span className='font-medium text-gray-700'>Privacy Policy</span> and{' '}
							<span className='font-medium text-gray-700'>Cookies Policy</span>.
						</p>

						<button
							type='submit'
							className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition'
						>
							{
								loading ? <CircularProgress size="30px" /> : 'Sign up'
							}

						</button>
					</form>

					<div className='text-center mt-6 border-t pt-4 text-sm text-gray-600'>
						Have an account?{' '}
						<Link href='/login' className='text-blue-600 font-medium hover:underline'>
							Log in
						</Link>
					</div>
				</div>
				{
					wrong &&
					<p className='text-red-600  text-[15px] text-center mt-3' >Something is go wrong </p>
				}
			</aside>

			<style jsx>{`
				.input-style {
					width: 100%;
					padding: 10px 14px;
					border: 1px solid #e5e7eb;
					border-radius: 8px;
					background-color: #f9fafb;
					outline: none;
					font-size: 14px;
					transition: 0.2s ease;
				}
				.input-style:focus {
					border-color: #cbd5e0;
					background-color: #fff;
				}
			`}</style>
		</section>
	)
}
