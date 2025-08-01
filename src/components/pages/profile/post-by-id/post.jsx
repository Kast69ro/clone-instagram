"use client";

import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store-by-id";
import { API } from "@/utils/config";
import { useEffect, useState } from "react";
import PostModalById from "../post-modal-by-id/post-modal";

export default function PostById({ id }) {
  const { getPostById, postById } = useProfileByIdStore();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    getPostById(id);
  }, [id]);

  return (
    <>
      <div className="grid grid-cols-3 gap-[2px] sm:gap-4 px-1 sm:px-0">
        {postById?.map((el) => {
          const file = el?.images?.[0];
          const src = `${API}/images/${file}`;
          const isVideo = file?.endsWith(".mp4");

          return (
            <div
              onClick={() => setSelectedPost(el)}
              key={el.postId}
              className="w-full aspect-square overflow-hidden cursor-pointer"
            >
              {isVideo ? (
                <video
                  src={src}
                  className="w-full h-full object-cover rounded"
                  muted
                  playsInline
                  preload="metadata"
                  autoPlay
                />
              ) : (
                <img
                  src={src}
                  alt="user post"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded"
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedPost && (
        <PostModalById post={selectedPost} onClose={() => setSelectedPost(null)} id={id} />
      )}
    </>
  );
}
