import { useState } from "react";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import BackspaceIcon from '@mui/icons-material/Backspace';
import { API } from "@/utils/config";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import {useProfileStore } from "@/store/pages/profile/profile/store-profile";
import {jwtDecode} from "jwt-decode";

export default function PostModal({ post, onClose }) {
  const {
    likePost,
    addComment,
    currentUser,
    deleteComment,
    deletePost, 
  } = useProfileStore();

  const token = localStorage.getItem("access_token");
  const myId = token ? jwtDecode(token)?.sid : null;

  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.postLikeCount);
  const [liked, setLiked] = useState(post.postLike || false);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const createComment = {
      comment: newComment,
      postId: post.postId,
    };

    setComments((prev) => [...prev, createComment]);
    setNewComment("");

    addComment(createComment);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes((prev) => prev + (liked ? -1 : 1));
    likePost(post.postId);
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.postCommentId !== commentId));
    deleteComment(commentId);
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post.postId, myId);
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="relative bg-white flex max-w-5xl w-full rounded-xl overflow-hidden shadow-lg">
        <div className="flex-1 min-w-0 flex items-center justify-center max-h-[90vh]">
          {post.images[0]?.endsWith(".mp4") ? (
            <video
              controls
              autoPlay
              className="max-h-full max-w-full object-contain"
            >
              <source src={`${API}/images/${post.images[0]}`} type="video/mp4" />
            </video>
          ) : (
            <img
              src={`${API}/images/${post.images[0]}`}
              alt="post"
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>

        <div className="w-[400px] flex flex-col border-l border-gray-300 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Avatar
                src={post.userImage ? `${API}/images/${post.userImage}` : Profile}
                alt={post.userName}
              />
              <span className="font-semibold">{post.userName}</span>
            </div>

            <div className="flex items-center gap-1">
              {post.userId === myId && (
                <IconButton onClick={handleDeletePost} size="small">
                  <BackspaceIcon fontSize="small" color="error" />
                </IconButton>
              )}
              <IconButton onClick={onClose} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((c) => {
              const displayName =
                c.userName === currentUser?.userName ? "Вы" : c.userName;
              return (
                <div
                  key={c.postCommentId}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="flex gap-3">
                    <Avatar
                      src={c.userImage ? `${API}/images/${c.userImage}` : Profile}
                      alt={displayName}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{displayName}</span>
                      <span className="text-sm text-gray-800">{c.comment}</span>
                    </div>
                  </div>

                  {c.userId === myId && (
                    <IconButton
                      onClick={() => handleDeleteComment(c.postCommentId)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex items-center gap-3">
              <IconButton onClick={handleLike} color="error">
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <span className="font-semibold">{likes} лайков</span>
            </div>

            <div className="flex gap-2">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Добавьте комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newComment.trim()) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
