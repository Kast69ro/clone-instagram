"use client";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import instagramDefaultProfile from "#/icon/layout/instagramDefaultProfile.jpg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { usePostActions } from "@/store/pages/home/post-actions/post-actions";
import { Box, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import WriteComment from "../write-comment/write-comment";
import { useUser } from "@/store/pages/home/home";
import VideoPost from "../video-post/video-post";
import { API } from "@/utils/config";

export default function Comments({
  open,
  setOpen,
  postId,
  datePublished,
  // comments,
}) {
  const {
    postByID,
    getPostByID,
    addPostFavorite,
    isPostSaved,
    addLikePost,
    isPostLiked,
    likeCounts,
    getLikeCount,
    deleteComment,
  } = usePostActions();
  console.log('postByID: ', postByID)
  const comments = postByID?.comments || [];
  const { formatShortTime } = useUser();
  const [modalComment, setModalComment] = useState(false);
  const [isLikedComment, setIsLikedComment] = useState({});
  const saved = isPostSaved(postId);
  const isLiked = isPostLiked(postId);
  const likeCount = likeCounts[postId] || 0;
  const [idxComment, setIdxComment] = useState();

  // function baroi like-hoi comment
  const toggleLikeComment = (postCommentId) => {
    setIsLikedComment((prev) => ({
      ...prev,
      [postCommentId]: !prev[postCommentId],
    }));
  };

  //
  const toggleLike = () => {
    addLikePost(postId);
  };

  const toggleSave = () => {
    addPostFavorite(postId);
  };

  function handleDeleteCommet(commentId) {
    setModalComment(!modalComment);
    setIdxComment(commentId);
  }

  function delComment() {
    deleteComment(idxComment);
    setModalComment(false);
  }

  useEffect(() => {
    if (postId) {
      getPostByID(postId);
    }
  }, [postId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: "12px",
            overflow: "hidden",
            maxWidth: "90vw",
            width: "80%",
            height: "90vh",
          },
        }}
      >
        <DialogContent
          sx={{ padding: 0 }}
          className="flex flex-col md:flex-row h-[90vh] max-w-full overflow-hidden"
        >
          {/* LEFT: MEDIA */}
          <Box className="w-full md:w-1/2 h-64 md:h-full bg-black flex items-center justify-center">
            {postByID?.images &&
              postByID?.images?.map((media, index) =>
                media.endsWith(".mp4") ? (
                  <VideoPost src={`${API}/images/${media}`} />
                ) : (
                  <Image
                    key={index}
                    src={`${API}/images/${media}`}
                    width={400}
                    height={614}
                    alt="story"
                    className="w-full h-full object-cover"
                  />
                )
              )}
          </Box>

          {/* RIGHT: COMMENTS */}
          <Box className="w-full md:w-1/2 h-[calc(90vh-48px)] md:h-full flex flex-col bg-white p-4 overflow-y-auto relative">
            {/* Верхний блок: пользователь + меню */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200   bg-white">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 p-[2px] cursor-pointer">
                  <div className="bg-white rounded-full p-[3px]">
                    <Image
                      src={
                        postByID?.userImage
                          ? `${API}/images/${postByID.userImage}`
                          : instagramDefaultProfile
                      }
                      alt="story"
                      className="rounded-full object-cover h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <p className="font-semibold text-sm text-[#1E293B] truncate max-w-xs">
                  {postByID?.userName}
                </p>
              </div>
              <MoreHorizIcon className="cursor-pointer text-gray-600" />
            </div>

            {/* Контент поста */}
            {postByID?.content && (
              <div className="flex gap-3 items-center py-3">
                <div className="rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 p-[2px] cursor-pointer">
                  <div className="bg-white rounded-full p-[3px]">
                    <Image
                      src={
                        postByID?.userImage
                          ? `${API}/images/${postByID.userImage}`
                          : instagramDefaultProfile
                      }
                      alt="story"
                      className="rounded-full object-cover h-8 w-8"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-[#1E293B]">
                    {postByID.userName}
                  </p>
                  <p className="text-sm text-[#262626]">{postByID.content}</p>
                </div>
              </div>
            )}

            {/* Комментарии */}
            <div className="flex flex-col gap-4 mt-3">
              {comments.length > 0 ? (
                comments.map((comment, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-3"
                  >
                    {/* Avatar + текст */}
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 p-[2px] cursor-pointer">
                        <div className="bg-white rounded-full p-[2px]">
                          <Image
                            src={
                              comment.userImage
                                ? `${API}/images/${comment.userImage}`
                                : instagramDefaultProfile
                            }
                            alt="comment-user"
                            className=" rounded-full object-cover h-8 w-8"
                            width={32}
                            height={32}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className=" flex gap-2 items-center ">
                          <p className="text-sm font-semibold text-[#262626]">
                            {comment.userName}
                          </p>
                          <p className="text-sm text-[#262626]">
                            {comment.comment}
                          </p>
                        </div>

                        <div className="flex gap-2 items-center">
                          <p className="text-xs text-gray-500 mt-1 cursor-pointer ">
                            {formatShortTime(comment.dateCommented)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 cursor-pointer">
                            Reply
                          </p>
                          <p
                            onClick={() =>
                              handleDeleteCommet(comment.postCommentId)
                            }
                            className="text-[14px] text-gray-500 cursor-pointer font-semibold"
                          >
                            ...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Лайк */}
                    <IconButton
                      color="error"
                      onClick={() => toggleLikeComment(comment.postCommentId)}
                      size="small"
                      className="self-start"
                    >
                      {isLikedComment[comment.postCommentId] ? (
                        <FavoriteIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{ fontSize: 18, color: "#262626" }}
                        />
                      )}
                    </IconButton>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No comments...</p>
              )}
            </div>

            {/* Пост и кнопки снизу */}
            <div className="sticky bottom-0 bg-white py-2 border-t border-gray-200 mt-auto">
              {/* Иконки и лайки */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2">
                  <IconButton color="error" onClick={toggleLike}>
                    {isLiked ? (
                      <FavoriteIcon className="text-red-500" />
                    ) : (
                      <FavoriteBorderIcon className="text-black" />
                    )}
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutlineIcon className="text-black" />
                  </IconButton>
                  <IconButton>
                    <SendIcon className="text-black" />
                  </IconButton>
                </div>
                <IconButton
                  onClick={() => toggleSave(postId)}
                  className="text-black"
                >
                  {saved ? <BookmarkIcon /> : <TurnedInNotIcon />}
                </IconButton>
              </div>

              {likeCount > 0 && (
                <p className="text-sm font-bold text-[#1E293B] mb-2 px-1">
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </p>
              )}
              <p className="text-[14px] text-gray-500 pl-1 cursor-pointer "> {formatShortTime(datePublished)} ago</p>

              {/* Компонент ввода комментария */}
              <WriteComment postId={postId} />
            </div>
          </Box>
        </DialogContent>
      </Dialog>
      {modalComment && (
        <div className="bg-[#4b4b4b] w-full h-full">
          <div className="fixed top-[40%] z-4000 flex flex-col w-[400px] gap-1 bg-[#ccc] rounded-[30px] py-2  ">
            <button onClick={delComment}>Delete</button>
            <hr />
            <button onClick={() => setModalComment(false)}>Cancel</button>
          </div>
        </div>
      )}
    </Fragment>
  );
}
