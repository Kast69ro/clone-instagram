import {jwtDecode} from 'jwt-decode';

const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

let userId = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.sid || decoded.userId || null; 
  } catch (e) {
    console.error("Invalid token", e);
  }
}

export const api = process.env.NEXT_PUBLIC_API;

export { token, userId };
