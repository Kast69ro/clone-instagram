"use client";

import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { API } from "@/utils/config";
import { useEffect, useState } from "react";
import PostModal from "../post-modal/post-modal";

export default function Saved() {
  const { getMySaved, saved } = useProfileStore();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    getMySaved();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-[2px] sm:gap-4 px-1 sm:px-0">
        {saved?.map((el) => {
          const file = el?.images?.[0];
          const isVideo = typeof file === "string" && file.endsWith(".mp4");
          const src = `${API}/images/${file}`;

          return (
            <div
              onClick={() => setSelectedPost(el)}
              key={el.postId}
              className="w-full aspect-square overflow-hidden"
            >
              {isVideo ? (
                <video
                  src={src}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded"
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
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}
