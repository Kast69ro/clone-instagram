import{ jwtDecode }from 'jwt-decode'

const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
export const userId = typeof window !== 'undefined' ?  jwtDecode(token) : null

export const api = process.env.NEXT_PUBLIC_API

export { token, userId, api }