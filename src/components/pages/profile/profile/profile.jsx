"use client";

import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { useEffect, useState } from "react";
import Stories from "../story/story";
import {jwtDecode} from "jwt-decode";
import BasicTabs from "../tabs/tabs";
import Link from "next/link";
import FollowersMenu from "../folowers/folowers";
import FollowingMenu from "../folowing/folowing";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeModal from "../qrcode/qrcode";
import { useRouter } from "next/navigation";
import { API } from "@/utils/config";

const Profiles = () => {
  const { getInfo, info, getStories, getFolowers, getFolowing } = useProfileStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openFolowing, setOpenFolowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [decode, setDecode] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setDecode(decoded);
    getInfo(decoded.sid);
    getStories(decoded.sid);
  }, [getInfo, getStories]);

  const showFolowers = () => {
    if (!decode) return;
    getFolowers(decode.sid);
    getFolowing(decode.sid);
    setOpen(true);
  };

  const showFolowing = () => {
    if (!decode) return;
    getFolowers(decode.sid);
    getFolowing(decode.sid);
    setOpenFolowing(true);
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  const handleShowQr = () => {
    setQrOpen(true);
    handleMenuClose();
  };

  const handleQrClose = () => setQrOpen(false);

  return (
    <>
      <div className="w-full px-4">
        <div className="max-w-[900px] mx-auto py-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-gray-300 overflow-hidden">
            {info?.image ? (
              <img
                src={`${API}/images/${info.image}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl text-gray-500">
                ?
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {info?.userName || "Username"}
              </h2>
              <div className="flex gap-2">
                <Link href="/profile/edit-profile">
                  <button className="bg-gray-100 px-4 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-200">
                    Edit profile
                  </button>
                </Link>
                <button className="bg-gray-100 px-4 py-1 rounded-md text-sm border border-gray-300 hover:bg-gray-200">
                  View archive
                </button>
              </div>
              <div
                onClick={handleMenuOpen}
                className="cursor-pointer text-xl sm:text-2xl hidden sm:block"
                aria-label="Open menu"
              >
                ☰
              </div>
            </div>

            <div className="flex gap-6 mt-4 text-sm text-gray-700">
              <span>
                <strong>{info?.postCount || 0}</strong> posts
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={showFolowers}
              >
                <strong>{info?.subscribersCount || 0}</strong> followers
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={showFolowing}
              >
                <strong>{info?.subscriptionsCount || 0}</strong> following
              </span>
            </div>

            {info?.firstName && (
              <div className="mt-3 font-medium text-sm">{info.firstName}</div>
            )}
          </div>
        </div>

        {info?.about && (
          <div className="w-[700px] ml-[12%] break-words">{info.about}</div>
        )}

        <div className="max-w-[900px] mx-auto mb-6">
          <Stories />
        </div>
        <div className="max-w-[900px] mx-auto">
          <BasicTabs />
        </div>
      </div>

      <FollowersMenu open={open} onClose={() => setOpen(false)} />
      <FollowingMenu open={openFolowing} onClose={() => setOpenFolowing(false)} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
      >
        <MenuItem onClick={handleShowQr}>
          <QrCodeIcon fontSize="small" className="mr-2" /> QR Code
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon fontSize="small" className="mr-2" /> Logout
        </MenuItem>
      </Menu>

      <QrCodeModal open={qrOpen} onClose={handleQrClose} />
    </>
  );
};

export default Profiles;
