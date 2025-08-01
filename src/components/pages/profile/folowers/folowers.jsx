"use client";
import { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import { X } from "lucide-react";
import { API } from "@/utils/config";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

export default function FollowersMenu({ open, onClose }) {
  const { folowers, folowing, postFolowing, deleteFolowing } = useProfileStore();
  const [localFollowers, setLocalFollowers] = useState([]);

  const [decode, setDecode] = useState(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const decoded = jwtDecode(token);
        setDecode(decoded);
      }
    } catch (e) {
      console.error("Ошибка при декодировании токена:", e);
    }
  }
}, []);

  useEffect(() => {
    if (open && folowers) {
      const followingIds = new Set(folowing?.map((f) => f.userShortInfo?.userId));
      const updated = folowers.map((follower) => ({
        ...follower,
        isFollowing: followingIds.has(follower.userShortInfo?.userId),
      }));
      setLocalFollowers(updated);
    }
  }, [open, folowers, folowing]);

  const toggleFollow = async (userId, isCurrentlyFollowing) => {

    setLocalFollowers((prev) =>
    prev.map((user) =>
      user.userShortInfo.userId === userId
        ? { ...user, isFollowing: !isCurrentlyFollowing }
        : user
    )
  );

  try {
    if (isCurrentlyFollowing) {
      await deleteFolowing(userId,decode.sid);
    } else {
      await postFolowing(userId,decode.sid);
    }
  } catch (error) {
    console.error("Ошибка при смене подписки:", error);

    
  }
};

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="fixed inset-0 flex justify-center items-center z-50"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="bg-white rounded-xl w-[90%] max-w-sm max-h-[80vh] overflow-hidden flex flex-col">
          <div className="relative px-4 py-3 border-b">
            <Typography className="text-center font-semibold text-base">
              Подписчики
            </Typography>
            <IconButton onClick={onClose} className="absolute right-2 top-2">
              <X />
            </IconButton>
          </div>

          <div className="overflow-y-auto px-4 py-2 space-y-3">
            {localFollowers.map((el) => {
              const user = el.userShortInfo;
              const isFollowing = el.isFollowing;

              return (
                <div key={user.userId} className="flex items-center justify-between">
                  <Link href={`/profile/${user.userId}`}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`${API}/images/${user.userPhoto}`}
                      alt={user.userName}
                      sx={{ width: 44, height: 44 }}
                      />
                    <Typography className="text-sm font-medium">
                      {user.userName}
                    </Typography>
                  </div>
                      </Link>

                  <Button
                    onClick={() => toggleFollow(user.userId, isFollowing)}
                    variant={isFollowing ? "outlined" : "contained"}
                    size="small"
                    className="capitalize text-sm"
                  >
                    {isFollowing ? "Отписаться" : "Подписаться"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
