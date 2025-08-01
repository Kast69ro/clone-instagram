"use client"
import * as React from "react"
import {
  Box,
  Modal,
  Typography,
  Avatar,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  MoreHoriz,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Send,
  BookmarkBorder,
  Bookmark,
  EmojiEmotions,
  VolumeUp,
  VolumeOff,
  ArrowBack,
} from "@mui/icons-material"
import { API } from "@/utils/config"
import { useExplorePage } from "@/store/pages/explore/explore"
import Link from "next/link"

const desktopStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 1200,
  height: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  display: "flex",
  overflow: "hidden",
}

const mobileStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  bgcolor: "background.paper",
  overflow: "auto",
}

const mobileCommentsStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  bgcolor: "background.paper",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

export default function InstagramModal({ open, setOpen, selectedPost, userId }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const handleClose = () => setOpen(false)

  const { AddComment, dataComments, setInitialComments, likePost, addFavorite, following, unfollowing } =
    useExplorePage()

  const [textComment, setTextComment] = React.useState("")
  const [isLiked, setIsLiked] = React.useState(selectedPost?.postLike || false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [follow, setFollow] = React.useState(false)
  const [likedComments, setLikedComments] = React.useState(new Set())
  const [isFavorited, setIsFavorited] = React.useState(false)
  const [commentsModalOpen, setCommentsModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (selectedPost) {
      setInitialComments(selectedPost.comments)
      setIsLiked(selectedPost.postLike || false)
    }
  }, [selectedPost])

  React.useEffect(() => {
    const video = document.getElementById("post-video")
    if (video && video instanceof HTMLVideoElement) {
      video.muted = false
      setIsMuted(false)
      video.play().catch((e) => {
        console.log("Autoplay error:", e)
      })
    }
  }, [selectedPost])

  function sendComment() {
    const text = {
      comment: textComment,
      postId: selectedPost.postId,
    }
    AddComment(text)
    setTextComment("")
  }

  function handleLike() {
    if (!selectedPost) return
    likePost(selectedPost.postId)
    setIsLiked((prev) => !prev)
  }

  function handleFollow() {
    if (follow) {
      unfollowing(selectedPost.userId)
    } else {
      following(selectedPost.userId)
    }
    setFollow((prev) => !prev)
  }

  function handleFavorite() {
    setIsFavorited((prev) => !prev)
    addFavorite(selectedPost.postId)
  }

  function handleCommentLike(commentIndex) {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentIndex)) {
        newSet.delete(commentIndex)
      } else {
        newSet.add(commentIndex)
      }
      return newSet
    })
  }

  function handleCommentsClick() {
    if (isMobile) {
      setCommentsModalOpen(true)
    }
  }

  if (isMobile) {
    return (
      <>
        <Modal open={open} onClose={handleClose} aria-labelledby="post-modal">
          <Box sx={mobileStyle}>
      
            <Box
              sx={{
                position: "sticky",
                top: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                zIndex: 10,
              }}
            >
              <IconButton onClick={handleClose} size="small">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Публикация
              </Typography>
              <Box sx={{ width: 40 }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                 <Link href={`/profile/${selectedPost?.userId}`}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                <Avatar src={selectedPost?.userPhoto} sx={{ width: 32, height: 32 }} />
                <Typography variant="body2" fontWeight="bold">
                  {selectedPost?.userName}
                </Typography>
                </Box>
                </Link>
                <Button
                  onClick={handleFollow}
                  size="small"
                  variant="text"
                  color="primary"
                  sx={
                    follow
                      ? {
                          bgcolor: theme.palette.action.hover,
                          color: theme.palette.text.primary,
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#e0e0e0",
                          },
                        }
                      : {}
                  }
                >
                  {follow ? "Подписки" : "Подписаться"}
                </Button>
              </Box>
              <IconButton size="small">
                <MoreHoriz />
              </IconButton>
            </Box>

        
            <Box
              sx={{
                width: "100%",
                backgroundColor: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                minHeight: "50vh",
              }}
            >
              {selectedPost?.images?.map((fileName) => {
                const isVideo = fileName.endsWith(".mp4") || fileName.endsWith(".webm")
                const src = `${API}/images/${fileName}`
                if (isVideo) {
                  return (
                    <Box key={selectedPost.postId} sx={{ position: "relative", width: "100%" }}>
                      <video
                        id="post-video"
                        src={src}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                        onClick={(e) => {
                          const video = e.currentTarget
                          if (video.paused) {
                            video.play()
                          } else {
                            video.pause()
                          }
                        }}
                        autoPlay
                        playsInline
                        muted={isMuted}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const video = document.getElementById("post-video")
                          if (video && video instanceof HTMLVideoElement) {
                            video.muted = !video.muted
                            setIsMuted(video.muted)
                          }
                        }}
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          right: 16,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          color: "white",
                          zIndex: 2,
                          "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.7)",
                          },
                        }}
                      >
                        {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                      </IconButton>
                    </Box>
                  )
                }
                return (
                  <img
                    key={selectedPost.postId}
                    src={src || "/placeholder.svg"}
                    alt="Post content"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                )
              })}
            </Box>

            <Box sx={{ backgroundColor: theme.palette.background.paper }}>
              <Box sx={{ p: 2, pb: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" onClick={handleLike} color={isLiked ? "error" : "default"}>
                      {isLiked ? <Favorite sx={{ color: "red" }} /> : <FavoriteBorder />}
                    </IconButton>
                    <IconButton size="small" onClick={handleCommentsClick}>
                      <ChatBubbleOutline />
                    </IconButton>
                    <IconButton size="small">
                      <Send />
                    </IconButton>
                  </Box>
                  <IconButton onClick={handleFavorite} size="small">
                    {isFavorited ? <Bookmark sx={{ color: theme.palette.text.primary }} /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
                {selectedPost?.postLikeCount === 0 ? (
                  <Typography sx={{ textAlign: "start" }} variant="body2" fontWeight="bold">
                    Поставьте первую отметку "Нравится"!
                  </Typography>
                ) : (
                  <Typography variant="body2" fontWeight="bold">
                    {selectedPost?.postLikeCount + (isLiked !== selectedPost?.postLike ? (isLiked ? 1 : -1) : 0)}{" "}
                    отметок "Нравится"
                  </Typography>
                )}
                <Button
                  variant="text"
                  size="small"
                  onClick={handleCommentsClick}
                  sx={{
                    p: 0,
                    textTransform: "none",
                    color: "text.secondary",
                    justifyContent: "flex-start",
                    minWidth: "auto",
                  }}
                >
                  Посмотреть все комментарии ({dataComments.length})
                </Button>
                <Typography variant="caption" color="text.secondary" display="block">
                  Сейчас.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Modal>

        
        <Modal open={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} aria-labelledby="comments-modal">
          <Box sx={mobileCommentsStyle}>
            
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                position: "relative",
              }}
            >
              <IconButton
                onClick={() => setCommentsModalOpen(false)}
                sx={{
                  position: "absolute",
                  left: 16,
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" fontWeight="bold">
                Комментарии
              </Typography>
            </Box>

           
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {dataComments && dataComments.length > 0 ? (
                dataComments.map((comment, idx) => (
                  <Box key={idx} sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar src={`${API}/images/${comment.userImage}`} sx={{ width: 32, height: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {comment.userName}
                          </Typography>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {comment.comment}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Сейчас.
                          </Typography>
                          <Button
                            size="small"
                            variant="text"
                            sx={{
                              p: 0,
                              minWidth: "auto",
                              textTransform: "none",
                              color: "text.secondary",
                              fontSize: "12px",
                            }}
                          >
                            Ответить
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            sx={{
                              p: 0,
                              minWidth: "auto",
                              textTransform: "none",
                              color: "text.secondary",
                              fontSize: "12px",
                            }}
                          >
                            Показать перевод
                          </Button>
                        </Box>

                        
                        <Button
                          size="small"
                          variant="text"
                          sx={{
                            p: 0,
                            mt: 1,
                            minWidth: "auto",
                            textTransform: "none",
                            color: "text.secondary",
                            fontSize: "12px",
                            justifyContent: "flex-start",
                          }}
                        >
                          ——— Смотреть все ответы (2)
                        </Button>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                        <IconButton size="small" onClick={() => handleCommentLike(idx)} sx={{ p: 0.5 }}>
                          {likedComments.has(idx) ? (
                            <Favorite fontSize="small" sx={{ color: "red" }} />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                        {likedComments.has(idx) && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "10px" }}>
                            1
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                  }}
                >
                  <Typography color="text.secondary" align="center">
                    Комментариев пока нет. <br /> Начните переписку.
                  </Typography>
                </Box>
              )}
            </Box>

            
            <Box
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Typography variant="body2">Я</Typography>
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    value={textComment}
                    onChange={(e) => setTextComment(e.target.value)}
                    fullWidth
                    placeholder="Добавьте комментарий..."
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: textComment.trim() && (
                        <InputAdornment position="end">
                          <Button
                            onClick={sendComment}
                            size="small"
                            color="primary"
                            sx={{
                              textTransform: "none",
                              fontWeight: "bold",
                              minWidth: "auto",
                            }}
                          >
                            Опубликовать
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                      },
                    }}
                  />
                </Box>
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Modal>
      </>
    )
  }


  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="post-modal">
      <Box sx={desktopStyle}>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {selectedPost?.images?.map((fileName) => {
            const isVideo = fileName.endsWith(".mp4") || fileName.endsWith(".webm")
            const src = `${API}/images/${fileName}`
            if (isVideo) {
              return (
                <Box key={selectedPost.postId} sx={{ position: "relative", width: "100%", height: "100%" }}>
                  <video
                    id="post-video"
                    src={src}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onClick={(e) => {
                      const video = e.currentTarget
                      if (video.paused) {
                        video.play()
                      } else {
                        video.pause()
                      }
                    }}
                    autoPlay
                    playsInline
                    muted={isMuted}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const video = document.getElementById("post-video")
                      if (video && video instanceof HTMLVideoElement) {
                        video.muted = !video.muted
                        setIsMuted(video.muted)
                      }
                    }}
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      right: 16,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      zIndex: 2,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                  >
                    {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                  </IconButton>
                </Box>
              )
            }
            return (
              <img
                key={selectedPost.postId}
                src={src || "/placeholder.svg"}
                alt="Post content"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )
          })}
        </Box>
        <Box
          sx={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <Link href={`/profile/${selectedPost?.userId}`}>
              <Avatar src={selectedPost?.userPhoto} sx={{ width: 32, height: 32 }} />
               </Link>
              <Box>
                 <Link href={`/profile/${selectedPost?.userId}`}>
                <Typography variant="body2" fontWeight="bold">
                  {selectedPost?.userName}
                </Typography>
                 </Link>
                <Typography variant="caption" color="text.secondary">
                  Оригинальное аудио
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                onClick={handleFollow}
                size="small"
                variant="text"
                color="primary"
                sx={
                  follow
                    ? {
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.text.primary,
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#e0e0e0",
                        },
                      }
                    : {}
                }
              >
                {follow ? "Подписки" : "Подписаться"}
              </Button>
              <IconButton size="small">
                <MoreHoriz />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {dataComments.length > 0 ? (
              dataComments.map((el, idx) => (
                <Box key={idx} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Avatar src={API + "/images/" + el.userImage} sx={{ width: 32, height: 32 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {el.userName}
                        </Typography>
                        <Typography variant="body2">{el.comment}</Typography>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => handleCommentLike(idx)}>
                      {likedComments.has(idx) ? (
                        <Favorite fontSize="small" sx={{ color: "red" }} />
                      ) : (
                        <FavoriteBorder fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography color="text.secondary" align="center">
                  Комментариев пока нет. <br /> Начните переписку.
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small" onClick={handleLike} color={isLiked ? "error" : "default"}>
                    {isLiked ? <Favorite sx={{ color: "red" }} /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton size="small">
                    <ChatBubbleOutline />
                  </IconButton>
                  <IconButton size="small">
                    <Send />
                  </IconButton>
                </Box>
                <IconButton onClick={handleFavorite} size="small">
                  {isFavorited ? <Bookmark sx={{ color: theme.palette.text.primary }} /> : <BookmarkBorder />}
                </IconButton>
              </Box>
              {selectedPost?.postLikeCount === 0 ? (
                <Typography sx={{ textAlign: "start" }} variant="body2" color="text.primary">
                  Поставьте первую отметку "Нравится"!
                </Typography>
              ) : (
                <Typography variant="body2" fontWeight="bold">
                  {selectedPost?.postLikeCount + (isLiked !== selectedPost?.postLike ? (isLiked ? 1 : -1) : 0)} отметок
                  "Нравится"
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                7 июль
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (textComment.trim()) sendComment()
                }}
              >
                <TextField
                  value={textComment}
                  onChange={(e) => setTextComment(e.target.value)}
                  fullWidth
                  placeholder="Добавьте комментарий..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton size="small">
                          <EmojiEmotions />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button type="submit" size="small" color="primary">
                          Опубликовать
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </form>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
