"use client";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { API } from "@/utils/config";
import { useEffect, useState } from "react";
import PostModal from "../post-modal/post-modal";

export default function Reels() {
  const { getMyPost, posts } = useProfileStore();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    getMyPost();
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-[2px] sm:gap-4 px-1 sm:px-0">
        {posts
          ?.filter((el) => {
            const file = el?.images?.[0];
            return typeof file === "string" && file.endsWith(".mp4");
          })
          .map((el) => {
            const file = el?.images?.[0];
            const src = `${API}/images/${file}`;

            return (
              <div
                onClick={() => setSelectedPost(el)}
                key={el.postId}
                className="w-full aspect-square overflow-hidden rounded cursor-pointer"
              >
                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
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
