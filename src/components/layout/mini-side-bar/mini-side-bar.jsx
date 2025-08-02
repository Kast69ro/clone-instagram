"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tooltip, tooltipClasses } from "@mui/material";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  add,
  compas,
  compasActive,
  homeIcon,
  homeIconActive,
  instagramMiniLogo,
  like,
  likeActive,
  message,
  messageActive,
  searchIcon,
  searchIconActive,
  setting,
  settings,
  threads,
  video,
  videoActive,
} from "@/assets/icon/layout/svg";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import jwtDecode from "jwt-decode";
import { API } from "@/utils/config";
import { useDrawerStore } from "@/store/search/searchStore";
import CreatePostModal from "@/components/createPost/createpost";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { useDrawerNotification } from "@/store/notification/notificationStore";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "black",
    boxShadow: "0 0 5px 1px rgba(0,0,0, .0975)",
    fontSize: 11,
    ".MuiTooltip-arrow": {
      color: "white",
    },
  },
}));

const MiniSideBar = ({ children }) => {
  const { toggleDrawer, openDrawer, isOpen } = useDrawerStore();
  const { openDrawerNotifFunc } = useDrawerNotification();
  const { getInfo, info } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [open1, setOpen] = useState(false);

  // Рендер иконок в зависимости от пути
  const renderIcon = (path, activeIcon, inactiveIcon) =>
    pathname === path ? activeIcon : inactiveIcon;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawToken = localStorage.getItem("access_token");
      if (rawToken) {
        try {
          const decode = jwtDecode(rawToken);
          getInfo(decode.sid);
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    }
  }, [getInfo]);

  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("access_token");
      setToken(accessToken);

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);

      if (
        !accessToken &&
        pathname !== "/login" &&
        pathname !== "/registration"
      ) {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  const isAuthPage = pathname === "/login" || pathname === "/registration";

  return (
    <div className="flex">
      {!isAuthPage && (
        <section
          className="flex justify-center w-[50px] border-r-[2px] border-[#eee] h-[100vh]"
          style={{
            marginRight:
              pathname === "/chats" || !isOpen ? "0px" : "320px",
          }}
        >
          <div className="sideBar h-full pb-[100px]">
            <div className="m-auto flex justify-center pb-[10px] mt-[20px]">
              {instagramMiniLogo}
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-[0.5rem] mt-4">
                {/* Home */}
                <LightTooltip title={t("layout.home")} placement="right" arrow>
                  <Link href="/" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer">
                      {renderIcon("/", homeIconActive, homeIcon)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Search */}
                <button
                  onClick={openDrawer}
                  className="w-full flex items-center justify-start px-3 py-3 rounded-lg text-black cursor-pointer"
                  style={{ color: theme === "dark" ? "white" : "black" }}
                  aria-label={t("layout.search")}
                >
                  {searchIconActive}
                </button>

                {/* Explore */}
                <LightTooltip title={t("layout.explore")} placement="right" arrow>
                  <Link href="/explore" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer">
                      {renderIcon("/explore", compasActive, compas)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Reels */}
                <LightTooltip title={t("layout.reels")} placement="right" arrow>
                  <Link href="/reels" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer">
                      {renderIcon("/reels", videoActive, video)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Messages */}
                <LightTooltip title={t("layout.message")} placement="right" arrow>
                  <Link href="/chats" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer">
                      {renderIcon("/chats", messageActive, message)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Notifications */}
                <button
                  onClick={openDrawerNotifFunc}
                  className="w-full flex items-center justify-start px-3 py-3 rounded-lg text-black cursor-pointer"
                  aria-label={t("layout.notification")}
                >
                  {like}
                </button>

                {/* Create */}
                <LightTooltip title={t("layout.create")} placement="right" arrow>
                  <div
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setOpen(true);
                    }}
                  >
                    <AddBoxOutlinedIcon sx={{ color: "black" }} fontSize="medium" />
                    {/* <p className='text-lg'>{t('layout.create')}</p> */}
                  </div>
                </LightTooltip>

                <CreatePostModal open={open1} onClose={() => setOpen(false)} />

                {/* Profile */}
                <LightTooltip title={t("layout.profile")} placement="right" arrow>
                  <Link href="/profile" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center cursor-pointer">
                      {/* Используем Next/Image для оптимизации */}
                      <Image
                        className={`rounded-full ml-[10%] ${
                          pathname === "/profile" ? "border-2 border-black" : ""
                        }`}
                        src={info?.image ? `${API}/images/${info.image}` : Profile}
                        alt="Profile"
                        width={25}
                        height={25}
                      />
                    </div>
                  </Link>
                </LightTooltip>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="ml-0 w-full">{children}</div>
    </div>
  );
};

export default MiniSideBar;
