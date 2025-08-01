"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Trash2 } from "lucide-react";
import { API } from "@/utils/config";
import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store-by-id";

const StoriesLib = dynamic(() => import("react-insta-stories"), { ssr: false });

export default function StoryById({ id }) {
  const { storyById, getStoriesById, likeStory, deleteStories } = useProfileByIdStore();
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getStoriesById(id);
  }, [id, getStoriesById]);

  useEffect(() => {
    if (storyById?.userId) {
      setCurrentUser({ ...storyById });
    }
  }, [storyById]);

  const toggleLike = (storyId) => {
    setCurrentUser((prev) => {
      const updatedStories = prev.stories.map((s) => {
        if (s.id === storyId) {
          const newLiked = !s.liked;
          return {
            ...s,
            liked: newLiked,
            likedCount: s.likedCount + (newLiked ? 1 : -1),
          };
        }
        return s;
      });
      return { ...prev, stories: updatedStories };
    });

    likeStory(storyId);
  };

  const deleteStory = (storyId) => {
    const updated = currentUser.stories.filter((s) => s.id !== storyId);
    setCurrentUser((prev) => ({ ...prev, stories: updated }));

    if (updated.length === 0) {
      setShow(false);
    } else {
      setCurrentIndex(0);
    }

    deleteStories(storyId);
  };

  const formattedStories = useMemo(() => {
    if (!currentUser) return [];

    return currentUser.stories.map((s) => ({
      content: () => (
        <div className="relative w-full h-full bg-black">
          <img
            src={`${API}/images/${s.fileName}`}
            alt="story"
            className="object-contain w-full h-full"
          />

          <div className="absolute top-4 left-4 flex items-center gap-2 text-white">
            <img
              src={`${API}/images/${currentUser.userImage}`}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">{currentUser.userName}</span>
          </div>
        </div>
      ),
    }));
  }, [currentUser]);

  const currentStory = currentUser?.stories?.[currentIndex];

  return currentUser ? (
    <div className="p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
        {currentUser.stories.map((s, index) => {
          const isActive = index === currentIndex && show;

          return (
            <div key={s.id} className="flex flex-col items-center">
              <div
                onClick={() => {
                  setCurrentIndex(index);
                  setShow(true);
                }}
                className={`w-16 h-16 rounded-full p-[2.5px] cursor-pointer
                  ${
                    isActive
                      ? "border-4 bg-orange-500"
                      : "border-2 border-gray-300"
                  }
                  hover:border-orange-500 transition-colors duration-300`}
              >
                <img
                  src={`${API}/images/${currentUser.userImage}`}
                  alt={currentUser.userName}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <p className="text-xs text-center mt-1 truncate max-w-[64px]">
                {currentUser.userName}
              </p>
            </div>
          );
        })}
      </div>

      {show && currentStory && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <StoriesLib
            stories={formattedStories}
            currentIndex={currentIndex}
            defaultInterval={5000}
            width={360}
            height={600}
            onAllStoriesEnd={() => setShow(false)}
            onStoryStart={(i) => setCurrentIndex(i)}
          />

          <div className="absolute top-4 right-4 flex flex-col gap-3 items-end">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => setShow(false)}
            >
              Close
            </button>
            <button
              onClick={() => toggleLike(currentStory.id)}
              className="flex items-center gap-1 bg-white text-black px-3 py-1 rounded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={currentStory.liked ? "red" : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <span className="text-sm">{currentStory.likedCount}</span>
            </button>

            <button
              onClick={() => deleteStory(currentStory.id)}
              className="bg-white text-black px-3 py-1 rounded"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
