"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { Button, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import inst from "@/assets/img/pages/profile/profile/inst.png";

import {
  homeIcon,
  homeIconActive,
  searchIcon,
  searchIconActive,
  compas,
  compasActive,
  video,
  videoActive,
  message,
  messageActive,
  like,
  likeActive,
  action,
  setting,
  savedIcon,
  problemIcon,
  threads,
} from "@/assets/icon/layout/svg";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { API } from "@/utils/config";
import { jwtDecode } from "jwt-decode";
import { useDrawerStore } from "@/store/search/searchStore";
import CreatePostModal from "@/components/createPost/createpost";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import MenuComp from "@/components/menuConfig/menu";
import { useThemeMode } from "@/components/providers/theme-context";
import theme from "@/theme/theme";
import { useDrawerNotification } from "@/store/notification/notificationStore";

const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:text-black ${isActive(
      href
    )}`}
  >
    {isActive(href) ? activeIcon : icon}
    <p className="text-lg">{label}</p>
  </Link>
);

export default function SideBar({ children }) {
  const { toggleDrawer, openDrawer } = useDrawerStore();
  const { openNotifDrawer, toggleDrawerNotif, openDrawerNotifFunc } =
    useDrawerNotification();

  const { getInfo, info } = useProfileStore();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation();
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [open1, setOpen] = useState(false);

  // const { theme } = useThemeMode()

  const theme = localStorage.getItem("theme");
  // console.log('THEME: ', theme)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let decode = null;

  if (typeof window !== "undefined") {
    const rawToken = localStorage.getItem("access_token");
    if (rawToken) {
      try {
        decode = jwtDecode(rawToken);
      } catch (error) {
        console.warn("❌ Invalid token", error);
      }
    }
  }

  // darkMode
  useEffect(() => {
    if (decode?.sid) {
      getInfo(decode.sid);
    }
  }, []);
  const isActive = (path) => (pathname === path ? "font-bold" : "font-normal");

  let isAuthPage = pathname === "/login" || pathname === "/registration";

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);

    if (!accessToken && pathname !== "/login" && pathname !== "/registration") {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <div>
      {!isAuthPage && (
        <section className="w-[320px] h-[100%] fixed  border-r-2 border-gray-300">
          <div className="sideBar h-full pb-[100px]">
            <div className="m-auto pt-[20px] ml-[20px] flex pb-[10px] mt-[20px]">
              <Image
                src={inst}
                alt="inst"
                className=""
                style={{ display: theme == "dark" ? "none" : "block" }}
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-2 mt-4">
                    <NavLink
                      href="/"
                      icon={homeIcon}
                      activeIcon={homeIconActive}
                      label={t("layout.home")}
                      isActive={isActive}
                    />

                    <Button
                      onClick={openDrawer}
                      startIcon={searchIconActive}
                      fullWidth
                      disableElevation
                      variant="text"
                      sx={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        height: "52px",
                        fontSize: "18.5px",
                        color: theme == "dark" ? "white" : "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          color: "black",
                        },
                        width: "90%",
                        margin: "0 auto",
                        gap: "10px",
                      }}
                    >
                      {t("layout.search")}
                    </Button>
                    <NavLink
                      href="/explore"
                      icon={compas}
                      activeIcon={compasActive}
                      label={t("layout.explore")}
                      isActive={isActive}
                    />
                    <NavLink
                      href="/reels"
                      icon={video}
                      activeIcon={videoActive}
                      label={t("layout.reels")}
                      isActive={isActive}
                    />
                    <NavLink
                      href="/chats"
                      icon={message}
                      activeIcon={messageActive}
                      label={t("layout.message")}
                      isActive={isActive}
                    />
                    {/* <NavLink
                      href="/notification"
                      icon={like}
                      activeIcon={likeActive}
                      label={t("layout.notification")}
                      isActive={isActive}
                    /> */}

                    <Button
                      onClick={openDrawerNotifFunc}
                      startIcon={likeActive}
                      fullWidth
                      disableElevation
                      variant="text"
                      sx={{
                        justifyContent: "flex-start",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        height: "52px",
                        fontSize: "18.5px",
                        color: theme == "dark" ? "white" : "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                          color: "black",
                        },
                        width: "90%",
                        margin: "0 auto",
                        gap: "10px",
                      }}
                    >
                      {t("layout.notification")}
                    </Button>

                    <div
                      onClick={() => setOpen(true)}
                      className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 cursor-pointer  dark:hover:text-black "
                    >
                      <AddBoxOutlinedIcon fontSize="medium" />
                      <p className="text-lg">{t("layout.create")}</p>
                    </div>
                    <CreatePostModal
                      open={open1}
                      onClose={() => setOpen(false)}
                    />

                    <div className="flex items-center gap-2 ml-[10%]">
                      <img
                        src={
                          info?.image
                            ? `${API}/images/${info.image}`
                            : Profile.src
                        }
                        className="w-5 h-5 rounded-full"
                        alt="Profile"
                      />

                      <NavLink
                        href="/profile"
                        icon={
                          <Image
                            className={`h-10 w-10 ${
                              pathname === "/profile"
                                ? "border-2 border-black rounded-full"
                                : ""
                            }`}
                            src={Profile}
                            alt="Profile"
                          />
                        }
                        label={t("layout.profile")}
                        isActive={isActive}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100  dark:hover:text-black">
                    {threads}
                    <p className="text-lg">{t("layout.threads")}qdw</p>
                  </div>

                  <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100   dark:hover:text-black">
                    <button onClick={handleClick} className="flex gap-5">
                      {setting}
                      <p className="text-lg">{t("layout.more")}</p>
                    </button>
                    <MenuComp
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* <div style={{ marginLeft: (pathname != '/login' && pathname !== '/registration') ? '370px' : '0px' }} className=''>
        {children}
      </div> */}

      <div
        style={{
          marginLeft:
            pathname != "/login" && pathname !== "/registration"
              ? "370px"
              : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
