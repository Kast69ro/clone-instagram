"use client";

import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { IconButton } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { usePostActions } from "@/store/pages/home/post-actions/post-actions";

export default function WriteComment({ postId }) {
  const [comment, setComment] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { postComment, getPostByID } = usePostActions();

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await postComment(comment, postId);
      setComment("");
    } catch (err) {
      console.log("Ошибка:", err);
    }
  };

  return (
    <div className="relative w-full flex items-center border-t border-gray-200 px-3 mt-3 bg-white">
      <IconButton
        onClick={() => setShowEmoji((prev) => !prev)}
        className="text-gray-600"
        size="small"
      >
        <EmojiEmotionsIcon />
      </IconButton>

      <input
        type="text"
        className="flex-1 outline-none border-none px-3 text-sm bg-transparent placeholder:text-gray-400"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className={`text-sm font-semibold text-blue-500 hover:opacity-80 transition ${
          comment.trim() ? "" : "opacity-40 pointer-events-none"
        }`}
      >
        Post
      </button>
    </div>
  );
}
