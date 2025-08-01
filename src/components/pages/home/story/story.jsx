"use client";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StoriesViewer from "react-insta-stories";
import {jwtDecode} from "jwt-decode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useStory } from "@/store/pages/home/story/story";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { IconButton } from "@mui/material";
import { API } from "@/utils/config";

export default function Story() {
  const { stories, getStories, getSubscribtions, addStories, deleteStories } = useStory();
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [openStory, setOpenStory] = useState(null);
  const [watchedStories, setWatchedStories] = useState(new Set());
  const { info } = useProfileStore();
  const [hasMyStory, setHasMyStory] = useState(false);
  const [myStory, setMyStory] = useState(null);
  const fileInputRef = useRef(null);
  const [likeStorySync, setLikeStorySync] = useState(false);

  const toggleLike = (id) => {
    setLikeStorySync(!likeStorySync);
    // TODO: Add like logic to API/store if needed
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params && swiperRef.current.navigation) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decode = jwtDecode(token);
    getStories().then((allStories) => {
      const foundMyStory = allStories?.find((story) => story.userId === decode.sid);
      if (foundMyStory) {
        setHasMyStory(true);
        setMyStory(foundMyStory);
      }
    });
    getSubscribtions(decode.sid);
  }, []);

  const openStoryViewer = (story) => {
    if (!story) return;
    setOpenStory(story);
    setWatchedStories((prev) => new Set(prev).add(story.userId));
  };

  const closeViewer = () => {
    setOpenStory(null);
  };

  const handleMyStoryUpload = async (e) => {
    const files = e.target.files;
    const token = localStorage.getItem("access_token");
    const decode = token ? jwtDecode(token) : null;
    if (!files || files.length === 0 || !decode) return;

    const formData = new FormData();
    formData.append("Image", files[0]);

    await addStories(formData);

    const allStories = await getStories();
    const updatedMyStory = allStories?.find((story) => story.userId === decode.sid);
    if (updatedMyStory) {
      setHasMyStory(true);
      setMyStory(updatedMyStory);
    }

    await getSubscribtions(decode.sid);
  };

  return (
    <div>
      <div className="relative py-4">
        <div
          ref={prevRef}
          className="swiper_button_prev hidden sm:flex absolute left-[11px] top-[50px] -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
        >
          <ArrowCircleLeftIcon />
        </div>

        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={12}
          slidesPerView="auto"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
        >
          {/* My Story */}
          <SwiperSlide className="!w-[60px] sm:!w-[60px] flex flex-col items-center text-center">
            <div
              className={`rounded-full ${
                myStory && watchedStories.has(myStory.userId)
                  ? "bg-[#ccc]"
                  : "bg-gradient-to-br from-pink-500 to-yellow-400"
              } p-[2px] cursor-pointer w-[60px]`}
              onClick={() => openStoryViewer(myStory)}
            >
              <div className="bg-white rounded-full p-[3px] relative">
                <Image
                  src={
                    info?.image
                      ? `${API}/images/${info.image}`
                      : "/ava.jpeg"
                  }
                  alt="your story"
                  className="imgStory1 rounded-full object-cover"
                  width={50}
                  height={50}
                />
                <span
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-[-6px] z-50 right-[-3px] bg-white border border-gray-500 rounded-full text-2xl w-[30px] h-[30px] flex items-center justify-center cursor-pointer"
                >
                  +
                </span>
                <input
                  id="my-story-input"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMyStoryUpload}
                />
              </div>
            </div>
            <p className="text-xs mt-1 truncate">My story</p>
          </SwiperSlide>

          {stories
            .filter((story) => !myStory || story.userId !== myStory.userId)
            .map((story) => {
              const isWatched = watchedStories.has(story.userId);
              return (
                <SwiperSlide
                  key={story.userId}
                  className="!w-[60px] sm:!w-[60px] flex flex-col items-center text-center"
                >
                  <div
                    className={`rounded-full ${
                      isWatched
                        ? "bg-[#ccc]"
                        : "bg-gradient-to-br from-pink-500 to-yellow-400"
                    } p-[2px] cursor-pointer w-[60px]`}
                    onClick={() => openStoryViewer(story)}
                  >
                    <div className="bg-white rounded-full p-[3px] ">
                      <Image
                        src={
                          story.userImage
                            ? `${API}/images/${story.userImage}`
                            : "/ava.jpeg"
                        }
                        alt="story"
                        className="imgStory1 rounded-full object-cover"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                  <p className="text-xs mt-1 truncate">{story.userName}</p>
                </SwiperSlide>
              );
            })}
        </Swiper>

        <div
          ref={nextRef}
          className="swiper_button_next hidden sm:flex absolute right-[10px] top-[50px] -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
        >
          <ArrowCircleRightIcon />
        </div>
      </div>

      {/* Viewer Overlay */}
      {openStory && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
          <div className="w-[90%] max-w-md relative">
            <StoriesViewer
              stories={
                openStory?.stories
                  ? openStory.stories.map((item) => ({
                      url: `${API}/images/${item.fileName}`,
                    }))
                  : []
              }
              defaultInterval={5000}
              onAllStoriesEnd={closeViewer}
            />

            <div className="absolute top-12 right-2 flex flex-col gap-3 py-2 px-1 bg-amber-300 rounded-md">
              <button
                onClick={closeViewer}
                className="text-lg font-bold hover:text-red-600 transition"
                aria-label="Close"
              >
                ✕
              </button>
              <IconButton
                onClick={() => toggleLike(openStory?.id)}
                size="small"
                className="transition-transform hover:scale-110"
              >
                {likeStorySync ? (
                  <FavoriteIcon className="text-red-500" fontSize="medium" />
                ) : (
                  <FavoriteBorderIcon className="text-gray-700" fontSize="medium" />
                )}
              </IconButton>
              <IconButton
                className="text-black"
                onClick={() => deleteStories(openStory?.id)}
                aria-label="Delete story"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton size="small" aria-label="Send story">
                <SendIcon className="cursor-pointer text-black" fontSize="small" />
              </IconButton>
            </div>

            <div className="px-4 pb-1 flex justify-center items-start md:ml-[-20px] ">
              <div className="w-full max-w-xl bg-white px-3 py-2 border-t border-gray-200 flex items-center gap-2 rounded-t-xl">
                <input
                  type="text"
                  placeholder="Send message..."
                  className="flex-1 px-4 py-[6px] rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
