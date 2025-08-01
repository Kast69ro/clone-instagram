"use client";

import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store-by-id";
import { API } from "@/utils/config";
import { useEffect } from "react";

export default function ReelsById({ id }) {
  const { getPostById, postById } = useProfileByIdStore();

  useEffect(() => {
    getPostById(id);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-[2px] sm:gap-4 px-1 sm:px-0">
      {postById
        ?.filter((el) => {
          const file = el?.images?.[0];
          return typeof file === "string" && file.endsWith(".mp4"); 
        })
        .map((el) => {
          const file = el?.images?.[0];
          const src = `${API}/images/${file}`;

          return (
            <div
              key={el.postId}
              className="w-full aspect-square overflow-hidden"
            >
              <video
                src={src}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded"
              />
            </div>
          );
        })}
    </div>
  );
}
