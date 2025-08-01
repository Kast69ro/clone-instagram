"use client"

import { useEffect, useRef, useState } from "react"
// Предполагается, что эти импорты доступны в вашем проекте
import { useReelsPage } from "@/store/pages/reels/reels"
import { API } from "@/utils/config"

// Импорты Material-UI Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import SendIcon from "@mui/icons-material/Send"
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder"
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CloseIcon from "@mui/icons-material/Close"
import BookmarkIcon from "@mui/icons-material/Bookmark"

// Импорты Material-UI Components
import { Avatar, Box, Button, IconButton, TextField, Typography } from "@mui/material"
import Link from 'next/link'

export default function ReelsPage() {
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  function handleClose() {
    setOpen(false)
  }

  // Предполагается, что useReelsPage() и API доступны
  const {
    data,
    getReels,
    likePost,
    addFollowingRelationship,
    deleteFollowingRelationship,
    addFavouriePost,
    addComment,
  } = useReelsPage()

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [pausedStates, setPausedStates] = useState({})
  const videoRefs = useRef([])
  const containerRef = useRef(null)
  const [text, setText] = useState("")

  const handleSend = () => {
    const postId = data[currentVideoIndex]?.postId
    if (!text.trim() || !postId) {
      console.warn("Нет текста или неверный postId:", postId)
      return
    }
    addComment({ postId, commentText: text })
    setText("")
  }

  useEffect(() => {
    getReels()
  }, [getReels])

  // Функция паузы и звука при скролле
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === currentVideoIndex) {
        if (pausedStates[index]) {
          video.pause()
        } else {
          video.play()
        }
        video.muted = isMuted
      } else {
        video.pause()
        video.muted = true
      }
    })
  }, [currentVideoIndex, isMuted, pausedStates])

  // Функция скролла рилсов
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop
      // Вычисляем новый индекс, округляя до ближайшего видео
      const newIndex = Math.round(scrollTop / (containerHeight * 0.9))
      if (newIndex !== currentVideoIndex && newIndex < data?.length) {
        setCurrentVideoIndex(newIndex)
      }
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [currentVideoIndex, data?.length])

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  // Функция для паузы/воспроизведения видео по клику
  const togglePause = (index) => {
    setPausedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          maxWidth: 430,
          mx: "auto",
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          py: "5vh",
        }}
      >
        {data?.map((el, index) => (
          <Box
            key={el.postId}
            sx={{
              position: "relative",
              width: "100%",
              height: "90vh",
              backgroundColor: "#000",
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
              borderRadius: 2,
              overflow: "hidden",
              mb: "2vh",
            }}
          >
            <video
              ref={(ref) => (videoRefs.current[index] = ref)}
              src={`${API}/images/${el.images}`}
              autoPlay={index === 0}
              loop
              muted={isMuted || index !== currentVideoIndex}
              playsInline
              onClick={() => togglePause(index)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
            <IconButton
              onClick={toggleMute}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "#fff",
                backgroundColor: "rgba(0,0,0,0.4)",
                width: 32,
                height: 32,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
              }}
            >
              {isMuted ? <VolumeOffIcon sx={{ fontSize: 20 }} /> : <VolumeUpIcon sx={{ fontSize: 20 }} />}
            </IconButton>
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 16,
                right: 70,
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
               <Link href={`/profile/${el.userId}`}>
                <Avatar
                  src={el.userImage ? `${API}/images/${el.userImage}` : "/default-avatar.png"}
                  sx={{
                    width: 32,
                    height: 32,
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
               </Link>
              <Link href={`/profile/${el.userId}` }>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: "14px" }}>
                  {el.userName}
                </Typography>
              
              </Link>
                <Typography sx={{ fontSize: "14px", mx: 0.5 }}>•</Typography>
                <Button
                  onClick={
                    el.isSubscriber
                      ? () => deleteFollowingRelationship(el.userId)
                      : () => addFollowingRelationship(el.userId)
                  }
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.3)",
                    textTransform: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    minWidth: "auto",
                    px: 1.5,
                    py: 0.3,
                    height: "24px",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "#fff",
                    },
                  }}
                >
                  {el.isSubscriber ? "Вы подписаны" : "Подписаться"}
                </Button>
              </Box>
              <Typography variant="body1" sx={{ mb: 1, fontSize: "15px", lineHeight: 1.3 }}>
                {el.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 1, lineHeight: 1.3, fontSize: "14px", mb: 1.5 }}>
                {el.content}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: "13px", opacity: 0.8 }}>
                  🎵 {el.userName} • Оригинальное аудио
                </Typography>
              </Box>
            </Box>
            {/* панели рост(чойи лайк,комент ва дига гапу чапо) */}
            <Box
              sx={{
                position: "absolute",
                right: 12,
                bottom: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <IconButton sx={{ color: "#fff", p: 0.5 }}>
                  {el.postLike ? (
                    <FavoriteIcon onClick={() => likePost(el.postId)} sx={{ fontSize: 26, color: "#ff3040" }} />
                  ) : (
                    <FavoriteBorderIcon onClick={() => likePost(el.postId)} sx={{ fontSize: 26 }} />
                  )}
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: "12px", fontWeight: 600, color: "white" }}>
                  {el.postLikeCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <IconButton sx={{ color: "#fff", p: 0.5 }}>
                  <ChatBubbleOutlineIcon onClick={handleClickOpen} sx={{ fontSize: 26 }} />
                </IconButton>
                <Typography variant="caption" sx={{ fontSize: "12px", fontWeight: 600, color: "white" }}>
                  {el.commentCount}
                </Typography>
              </Box>
              <IconButton sx={{ color: "#fff", p: 0.5 }}>
                <SendIcon sx={{ fontSize: 26 }} />
              </IconButton>
              <IconButton sx={{ color: "#fff", p: 0.5 }}>
                {el.postFavorite ? (
                  <BookmarkIcon onClick={() => addFavouriePost(el.postId)} sx={{ fontSize: 26 }} />
                ) : (
                  <BookmarkBorderIcon onClick={() => addFavouriePost(el.postId)} sx={{ fontSize: 26 }} />
                )}
              </IconButton>
              <IconButton sx={{ color: "#fff", p: 0.5 }}>
                <MoreHorizIcon sx={{ fontSize: 26 }} />
              </IconButton>
              <Box sx={{ mt: 1 }}>
                <Avatar
                  src={el.userImage ? `${API}/images/${el.userImage}` : "/default-avatar.png"}
                  sx={{
                    width: 28,
                    height: 28,
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {/* {модалкаи коментария} */}
      <Box
        sx={{
          position: "fixed",
          backgroundColor: "background.paper",
          boxShadow: 3,
          zIndex: 1300,
          display: open ? "flex" : "none",
          flexDirection: "column",
          // Стили для мобильных устройств (xs)
          bottom: { xs: 0, sm: "auto" }, // Прилипает к низу на мобильных
          left: { xs: 0, sm: "auto" }, // Полная ширина на мобильных
          right: { xs: 0, sm: "25px" }, // Прилипает к правой стороне на десктопе
          top: { xs: "auto", sm: "10vh" }, // Отступ сверху на десктопе
          width: { xs: "100%", sm: "320px" }, // Полная ширина на мобильных, фиксированная на десктопе
          height: { xs: "70vh", sm: "40vh" }, // Выше на мобильных, фиксированная на десктопе
          borderRadius: { xs: "16px 16px 0 0", sm: 2 }, // Закругленные верхние углы на мобильных, стандартные на десктопе
        }}
      >
        {/* Ручка для мобильных устройств */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" }, // Отображается только на мобильных
            justifyContent: "center",
            py: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              backgroundColor: "grey.400",
              borderRadius: 2,
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <IconButton onClick={handleClose} sx={{ ml: -1 }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center", mr: 4 }}>
            Комментарии
          </Typography>
        </Box>
        {/* Список комментариев */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 1 }}>
          {data?.[currentVideoIndex]?.comments?.length > 0 ? (
            data[currentVideoIndex].comments.map((comment, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
             
                {/* Аватар */}
                <Avatar
                  src={comment.userImage ? `${API}/images/${comment.userImage}` : "/no-avatar.png"}
                  alt={comment.userName}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                {/* Контент */}
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: "bold", mr: 1 }}>{comment.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.dateCommented).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 0.5 }}>{comment.comment}</Typography>
                </Box>
                {/* Лайк */}
                <IconButton size="small" sx={{ ml: 1 }}>
                  <FavoriteBorderIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography sx={{ px: 2, py: 1 }}>Комментариев пока нет</Typography>
          )}
        </Box>
        {/* Ввод нового комментария */}
        <Box
          sx={{
            borderTop: "1px solid #ddd",
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Добавьте комментарий…"
            variant="standard"
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  )
}
