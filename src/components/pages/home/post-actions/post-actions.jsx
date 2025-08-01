import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";
import { IconButton } from "@mui/material";
import { usePostActions } from "@/store/pages/home/post-actions/post-actions";
import Comments from "../comments/comments";
import { useUser } from "@/store/pages/home/home";

export default function PostActions({
  userName,
  content,
  commentCount,
  postId,
  comments,
  datePublished
}) {
  const {
    addPostFavorite,
    getPostByID,
    isPostSaved,
    addLikePost,
    isPostLiked,
    getLikeCount
  } = usePostActions();
  const {formatShortTime} = useUser()
  const [isCommit, setIsCommit] = useState(false);
  const [open, setOpen] = useState(false);
  const saved = isPostSaved(postId);
  const isLiked = isPostLiked(postId);
  const [showFullContent, setShowFullContent] = useState(false);
  const CHARACTER_LIMIT = 120;
  const likeCounts = getLikeCount(postId);



  // code baroi content ast, agar content ziyod boshad tanho 120 symbol megirad
  const truncateText = (text) => {
    if (text.length <= CHARACTER_LIMIT) return text;
    return text.slice(0, CHARACTER_LIMIT) + "...";
  };

  const handleClickOpen = () => {
    setOpen(true);
    setIsCommit(!isCommit);
    getPostByID(postId);
  };

  const toggleSave = () => {
    addPostFavorite(postId);
  };

  const toggleLike = () => {
    addLikePost(postId);
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      {/* Иконаҳо */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <IconButton
            color="error"
            onClick={() => toggleLike(postId)}
            size="small"
          >
            {isLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon
                className="cursor-pointer text-black"
                fontSize="small"
              />
            )}
          </IconButton>

          <IconButton onClick={() => handleClickOpen(postId)} size="small">
            <ChatBubbleOutlineIcon
              className="cursor-pointer text-black"
              fontSize="small"
            />
          </IconButton>

          <IconButton size="small">
            <SendIcon className="cursor-pointer text-black" fontSize="small" />
          </IconButton>
        </div>

        <IconButton
          className="cursor-pointer"
          style={{ color: "black" }}
          onClick={() => toggleSave(postId)}
          size="small"
        >
          {saved ? (
            <BookmarkIcon fontSize="small" />
          ) : (
            <TurnedInNotIcon fontSize="small" />
          )}
        </IconButton>
      </div>

      {/* Likes */}
      {likeCounts > 0 && (
        <p className="font-bold text-sm text-[#1E293B]">
          {likeCounts} {likeCounts === 1 ? "like" : "likes"}
        </p>
      )}

      {/* Контент ва Комментарийҳо */}
      <div className="flex flex-col gap-1">
        {content && (
          <p className="text-[#1E293B] text-sm leading-tight whitespace-pre-line">
            <span className="font-semibold">{userName} </span>
            {showFullContent ? (
              <>
                {content}{" "}
                <button
                  onClick={() => setShowFullContent(false)}
                  className="text-[#737373] text-sm font-medium ml-1 hover:underline"
                >
                  less
                </button>
              </>
            ) : (
              <>
                {truncateText(content)}{" "}
                {content.length > CHARACTER_LIMIT && (
                  <button
                    onClick={() => setShowFullContent(true)}
                    className="text-[#737373] text-sm font-medium ml-1 hover:underline"
                  >
                    more
                  </button>
                )}
              </>
            )}
          </p>
        )}

        {commentCount > 0 && (
          <p onClick={() => handleClickOpen(postId)} className="text-sm text-[#737373] leading-tight cursor-pointer">
            View all {commentCount} comments
          </p>
        )}
      
      </div>

      <div className="w-[100%] ">
        {isCommit && (
          <Comments
            open={open}
            setOpen={setOpen}
            comments={comments}
            postId={postId}
            datePublished={datePublished}
          />
        )}
      </div>
    </div>
  );
}
