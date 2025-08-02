"use client"
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg"
import {
  add,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  message,
  messageActive,
  video,
  videoActive,
} from "@/assets/icon/layout/svg"
import { useTranslation } from 'react-i18next'
import { useProfileStore } from "@/store/pages/profile/profile/store-profile"
import { API } from "@/utils/config"
import jwtDecode from "jwt-decode"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import CreatePostModal from '@/components/createPost/createpost'

export default function BottomNavigation({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  // CSS классы
  const iconClass =
    "flex items-center gap-4 rounded-[8px] h-[52px] px-0 m-[0] justify-center dark:text-black"
  const profileClass = "w-[25px] h-[25px] rounded-[50%]"

  // Иконки для путей
  const icons = {
    "/": { active: homeIcon, inactive: homeIconActive },
    "/explore": { active: compas, inactive: compasActive },
    "/reels": { active: video, inactive: videoActive },
    "/chats": { active: message, inactive: messageActive },
    "/profile": { active: Profile, inactive: Profile }, // Для профиля без активного состояния
  }

  const { getInfo, info } = useProfileStore()
  const [open1, setOpen] = useState(false)
  const [token, setToken] = useState(null)
  const [theme, setTheme] = useState('light')

  // Загрузка данных пользователя по токену
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenFromStorage = localStorage.getItem("access_token")
      if (tokenFromStorage) {
        try {
          const decode = jwtDecode(tokenFromStorage)
          getInfo(decode.sid)
          setToken(tokenFromStorage)
        } catch (err) {
          console.error("Invalid token", err)
          setToken(null)
        }
      }
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) setTheme(savedTheme)
    }
  }, [getInfo])

  // Редирект если неавторизован
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token')
      setToken(accessToken)
      if (!accessToken && pathname !== '/login' && pathname !== "/registration") {
        router.push('/login')
      }
    }
  }, [pathname, router])

  const { t } = useTranslation()
  const isAuthPage = pathname === '/login' || pathname === '/registration'

  return (
    <>
      {children}
      {!isAuthPage && (
        <section
          className="fixed w-full z-[10] bottom-0"
          style={{ color: theme === 'dark' ? 'white' : 'black' }}
        >
          <div className="flex gap-[0.5rem] mt-4 align-bottom bg-white justify-evenly">
            {/* Home */}
            <Link className="block" href="/">
              <div className={iconClass}>
                {pathname === "/" ? icons["/"].active : icons["/"].inactive}
              </div>
            </Link>

            {/* Explore */}
            <Link href="/explore">
              <div className={iconClass}>
                {pathname === "/explore"
                  ? icons["/explore"].active
                  : icons["/explore"].inactive}
              </div>
            </Link>

            {/* Reels */}
            <Link href="/reels">
              <div className={iconClass}>
                {pathname === "/reels"
                  ? icons["/reels"].active
                  : icons["/reels"].inactive}
              </div>
            </Link>

            {/* Create Button */}
            <div
              onClick={() => setOpen(true)}
              className="flex items-center rounded-md h-[52px] hover:bg-gray-100 cursor-pointer"
            >
              {add}
            </div>

            <CreatePostModal
              open={open1}
              onClose={() => setOpen(false)}
            />

            {/* Chats */}
            <Link href="/chats">
              <div className={iconClass}>
                {pathname === "/chats"
                  ? icons["/chats"].active
                  : icons["/chats"].inactive}
              </div>
            </Link>

            {/* Profile */}
            <Link href="/profile">
              <div className={iconClass}>
                <Image
                  className={`${pathname === "/profile" ? "border-[2px] border-solid border-black" : ""} ${profileClass}`}
                  src={info?.image ? `${API}/images/${info.image}` : Profile}
                  alt="Profile"
                  width={25}
                  height={25}
                />
              </div>
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
