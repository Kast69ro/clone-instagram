"use client"
import { useExplorePage } from "@/store/pages/explore/explore"
import React from "react"

import { API } from "@/utils/config"
import { useEffect, useState } from "react"
import BasicModal from "./modal"
import Skeleton from "@mui/material/Skeleton"
import Box from "@mui/material/Box"
import SearchIcon from "@mui/icons-material/Search"
import { useDrawerStore } from "@/store/search/searchStore"
import Image from "next/image"
// import { API } from '@/utils/config'
import ava from "@/assets/img/pages/profile/profile/ava.jpeg"
import ClearIcon from "@mui/icons-material/Clear"
import { useTheme } from "@mui/material/styles" 

export default function Explore() {
  const theme = useTheme()
  const {
    searchUser,
    datas,
    postSearchHistory,
    getSearchHistory,
    history,
    deleteSearchHistory,
    clearSearchHistory,
    loading,
  } = useDrawerStore()
  const { data, getExplore } = useExplorePage()
  const [open, setOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [openSearchDiv, setOpenSearchDiv] = useState(false)
  const [search, setSearch] = useState("")

  function handleSearch(e) {
    searchUser(e.target.value)
  }

  function handleClose() {
    setOpenSearchDiv(false)
    setSearch("")
  }

  useEffect(() => {
    if (openSearchDiv) {
      getSearchHistory()
    }
  }, [search])

  useEffect(() => {
    const fetchExplore = async () => {
      setIsLoading(true)
      await getExplore()
      setIsLoading(false)
    }
    fetchExplore()
  }, [])

  return (
    <>
      <div
        className="md:hidden pt-3 px-3 pb-2 mb-3 fixed top-0 left-0 right-0 z-20 shadow-md"
        style={{ backgroundColor: theme.palette.background.paper }} 
      >
        <div className="flex items-center justify-between gap-3 ">
          <div
            className="rounded-[5px] px-3 flex items-center border w-[100%]"
            style={{
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.divider,
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
            <input
              onClick={() => setOpenSearchDiv(true)}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value), handleSearch(e)
              }}
              type="text"
              placeholder="search"
              className="w-[90%] text-[18px] border-none outline-none focus:border-none focus:outline-none px-4 py-2"
              style={{
                backgroundColor: "transparent",
                color: theme.palette.text.primary, 
              }}
            />
          </div>
          <button
            onClick={handleClose}
            style={{
              display: openSearchDiv ? "block" : "none",
              color: theme.palette.text.primary, 
            }}
          >
            Отмена
          </button>
        </div>
        {openSearchDiv && (
          <div
            className="flex flex-col gap-5 fixed top-[60px] left-0 right-0 z-10 px-3 py-5 shadow-lg rounded-lg h-[100vh]"
            style={{ backgroundColor: theme.palette.background.paper }} 
          >
            <div className="flex justify-between">
              <h2 className="text-[17px] mb-5" style={{ color: theme.palette.text.primary }}>
                Недавнее
              </h2>
              <button
                onClick={clearSearchHistory}
                className="bg-transparent text-[17px] mb-5 text-[#0095F6] hover:text-black"
                style={{ color: theme.palette.primary.main }} 
              >
                Очистить все
              </button>
            </div>
            {loading ? (
              <div className="flex items-center gap-5">
                <Skeleton variant="circular" width={60} height={60} sx={{ bgcolor: theme.palette.action.hover }} />{" "}
                {/* Skeleton color */}
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: theme.palette.action.hover }} />
                  <Skeleton variant="text" width={200} height={20} sx={{ bgcolor: theme.palette.action.hover }} />
                </div>
              </div>
            ) : search === "" && history.length === 0 ? (
              <p className="m-auto mt-[200px]" style={{ color: theme.palette.text.secondary }}>
                Нет недавних запросов.
              </p>
            ) : search !== "" ? (
              datas?.map((user) => (
                <div key={user.id} className="flex items-center gap-5" onClick={() => postSearchHistory(user.id)}>
                  <Image
                    src={user.avatar !== "" ? `${API}/images/${user.avatar}` : ava}
                    alt="avatar"
                    width={70}
                    height={80}
                    className="rounded-[50%] w-[60px] h-[60px]"
                  />
                  <div>
                    <h2 style={{ color: theme.palette.text.primary }}>{user.userName}</h2>
                    <h3 style={{ color: theme.palette.text.secondary }}>
                      {user.fullName} . Подписчики {user.subscribersCount}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              history?.map((el) => (
                <div key={el.id} className="flex items-center justify-between">
                  <div className="flex items-center  gap-6">
                    <Image
                      src={el.users.avatar !== "" ? `${API}/images/${el.users.avatar}` : ava}
                      alt="avatar"
                      width={70}
                      height={80}
                      className="rounded-[50%] w-[60px] h-[60px]"
                    />
                    <div>
                      <h2 style={{ color: theme.palette.text.primary }}>{el.users.userName}</h2>
                      <h3 style={{ color: theme.palette.text.secondary }}>
                        {el.users.fullName} . Подписчики {el.users.subscribersCount}
                      </h3>
                    </div>
                  </div>
                  <ClearIcon onClick={() => deleteSearchHistory(el.id)} sx={{ color: theme.palette.action.active }} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="w-full max-w-[1000px] m-auto grid grid-cols-3 gap-[1px] mt-[65px] md:mt-5">
        {isLoading
          ? Array.from({ length: 15 }).map((_, i) => (
              <Box key={i} className="aspect-square">
                <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
              </Box>
            ))
          : Array.isArray(data) &&
            data.map((e, i) => (
              <div
                key={i} 
                className="relative group cursor-pointer aspect-square overflow-hidden"
                onClick={() => {
                  setOpen(true)
                  setSelectedPost(e)
                }}
              >
                {Array.isArray(e.images) &&
                  e.images.slice(0, 1).map((fileName) => {
                    const isVideo = fileName.endsWith(".mp4") || fileName.endsWith(".webm")
                    const src = `${API}/images/${fileName}`
                    return (
                      <React.Fragment key={fileName}>
                        
                        {isVideo ? (
                          <video autoPlay muted loop playsInline src={src} className="w-full h-full object-cover" />
                        ) : (
                          <img src={src || "/placeholder.svg"} alt="Media" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="text-white flex gap-6 font-semibold text-sm">
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M11.645 20.91a.75.75 0 0 0 .71 0l.003-.002.007-.004.022-.012a15.252 15.252 0 0 0 .383-.219 25.18 25.18 0 0 0 4.244-3.17c2.3-2.145 4.738-5.331 4.738-9.256 0-2.928-2.464-5.25-5.437-5.25A5.5 5.5 0 0 0 12 5.052 5.5 5.5 0 0 0 7.688 3C4.714 3 2.25 5.322 2.25 8.25c0 3.924 2.438 7.11 4.739 9.256a25.18 25.18 0 0 0 4.244 3.17c.134.078.264.15.383.218l.022.012.007.003Z" />
                              </svg>
                              <p>{e.postLikeCount}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p>{e.commentCount}</p>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    )
                  })}
              </div>
            ))}
      </div>
      <BasicModal open={open} setOpen={setOpen} selectedPost={selectedPost} />
    </>
  )
}
 