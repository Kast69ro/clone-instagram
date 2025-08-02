"use client";

import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import React, { useEffect, useState } from "react";
import FollowersMenu from "../folowers/folowers";
import FollowingMenu from "../folowing/folowing";
import { useRouter } from "next/navigation";
import { useProfileByIdStore } from "@/store/pages/profile/profile-by-id/store-by-id";
import BasicTabsById from "../tabs-by-id/tabs";
import StoryById from "../story-by-id/story";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import jwtDecode from "jwt-decode";
import { API } from "@/utils/config";

const ComponentProfileById = ({ userId }) => {
  const {
    getFolowers,
    getFolowing,
    deleteFolowing,
    folowing,
    postFolowing,
  } = useProfileStore();

  const { getInfoById, infoById, getChat, chats } = useProfileByIdStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openFolowing, setOpenFolowing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode(token);
        setMyId(decoded.sid);
      }
    }
    getChat();
  }, [getChat]);

  const chat = chats?.filter((el) => el.sendUserId == userId);

  useEffect(() => {
    if (!myId) return;
    getFolowing(myId);
  }, [myId, getFolowing]);

  useEffect(() => {
    if (!userId || !folowing) return;

    const isSubscribed =
      folowing?.some((f) => f.userShortInfo.userId === userId) || false;
    setSubscribed(isSubscribed);
  }, [userId, folowing]);

  useEffect(() => {
    if (!userId) return;
    getInfoById(userId);
  }, [userId, getInfoById]);

  const showFolowers = () => {
    if (!userId) return;
    getFolowers(userId);
    getFolowing(userId);
    setOpen(true);
  };

  const showFolowing = () => {
    if (!userId) return;
    getFolowers(userId);
    getFolowing(userId);
    setOpenFolowing(true);
  };

  const handleSubscribeToggle = async () => {
    const newState = !subscribed;
    setSubscribed(newState);

    try {
      if (newState) {
        await postFolowing(userId, myId);
      } else {
        await deleteFolowing(userId, myId);
      }
      await getInfoById(userId);
    } catch (error) {
      setSubscribed(!newState);
      console.error("Ошибка:", error);
    }
  };

  const openChat = () => {
    if (chat && chat.length > 0) {
      router.push(`/chats/${chat[0].chatId}`);
    } else {
      alert("Чат с этим пользователем еще не создан.");
    }
  };

  return (
    <>
      <div className="w-full  px-4">
        <div className="w-full max-w-[900px] mx-auto flex sm:flex-row items-start sm:items-center gap-5 sm:gap-12 py-4">
          <div className="w-45 h-30 sm:w-42 sm:h-34 rounded-[50%] overflow-hidden border border-gray-300">
            {infoById?.image ? (
              <img
                src={`${API}/images/${infoById.image}`}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl">
                ?
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:gap-5 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
              <h2 className="text-xl font-semibold">
                {infoById?.userName || "Username"}
              </h2>
            </div>

            <div className="flex gap-4 text-sm text-gray-600 cursor-pointer">
              <span>
                <strong>{infoById?.postCount || 0}</strong> posts
              </span>
              <span onClick={showFolowers} className="hover:underline">
                <strong>{infoById?.subscribersCount || 0}</strong> followers
              </span>
              <span onClick={showFolowing} className="hover:underline">
                <strong>{infoById?.subscriptionsCount || 0}</strong> following
              </span>
            </div>

            <div className="font-semibold text-sm">
              {infoById?.firstName || "Full Name"}
            </div>
          </div>
        </div>

        <div className="max-w-[900px] flex items-center gap-4 py-3 justify-center">
          <button
            onClick={handleSubscribeToggle}
            className={`px-5 py-1 rounded-md font-semibold text-sm border ${
              subscribed
                ? "border-gray-400 text-gray-600 hover:bg-gray-100"
                : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
            }`}
          >
            {subscribed ? "Отписаться" : "Подписаться"}
          </button>

          <button
            onClick={openChat}
            className="flex items-center justify-center px-4 py-1 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Открыть чат"
          >
            <ChatBubbleOutlineIcon fontSize="small" />
          </button>
        </div>

        <div className="w-full max-w-[900px] mx-auto">
          <StoryById id={userId} />
        </div>
        <div className="w-full max-w-[900px] mx-auto">
          <BasicTabsById id={userId} />
        </div>
      </div>

      <FollowersMenu open={open} onClose={() => setOpen(false)} />
      <FollowingMenu open={openFolowing} onClose={() => setOpenFolowing(false)} />
    </>
  );
};

export default ComponentProfileById;
