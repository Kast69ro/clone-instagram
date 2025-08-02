"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Profile from "@/assets/icon/layout/instagramDefaultProfile.jpg";
import { Button, Menu, MenuItem } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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
  likeActive,
  threads,
  setting,
} from "@/assets/icon/layout/svg";

import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { API } from "@/utils/config";
import jwtDecode from "jwt-decode";
import { useDrawerStore } from "@/store/search/searchStore";
import CreatePostModal from "@/components/createPost/createpost";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import MenuComp from "@/components/menuConfig/menu";
import { useDrawerNotification } from "@/store/notification/notificationStore";

const NavLink = ({ href, icon, activeIcon, label, isActive }) => (
  <Link
    href={href}
    className={`flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:text-black cursor-pointer ${
      isActive ? "font-bold" : "font-normal"
    }`}
  >
    {isActive ? activeIcon : icon}
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

  const [theme, setTheme] = useState("light");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rawToken = localStorage.getItem("access_token");
    if (!rawToken) return;

    try {
      const decodedToken = jwtDecode(rawToken);
      if (decodedToken?.sid) {
        getInfo(decodedToken.sid);
      }
    } catch (err) {
      console.warn("Invalid token", err);
    }
  }, [getInfo]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);

    if (
      !accessToken &&
      pathname !== "/login" &&
      pathname !== "/registration"
    ) {
      router.push("/login");
    }
  }, [pathname, router]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => pathname === path;

  let isAuthPage = pathname === "/login" || pathname === "/registration";

  return (
    <div>
      {!isAuthPage && (
        <section
          className="w-[320px] h-[100%] fixed border-r-2 border-gray-300 bg-white dark:bg-gray-900"
          style={{ color: theme === "dark" ? "white" : "black" }}
        >
          <div className="sideBar h-full pb-[100px]">
            <div className="m-auto pt-[20px] ml-[20px] flex pb-[10px] mt-[20px]">
              {/* Логотип Instagram, можно скрывать в темной теме */}
              <Image
                src="/assets/img/pages/profile/profile/inst.png"
                alt="inst"
                style={{ display: theme === "dark" ? "none" : "block" }}
                width={120}
                height={40}
              />
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-2 mt-4">
                <NavLink
                  href="/"
                  icon={homeIcon}
                  activeIcon={homeIconActive}
                  label={t("layout.home")}
                  isActive={isActive("/")}
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
                    color: theme === "dark" ? "white" : "black",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      color: "black",
                    },
                    width: "90%",
                    margin: "0 auto",
                    gap: "10px",
                  }}
                  type="button"
                >
                  {t("layout.search")}
                </Button>

                <NavLink
                  href="/explore"
                  icon={compas}
                  activeIcon={compasActive}
                  label={t("layout.explore")}
                  isActive={isActive("/explore")}
                />
                <NavLink
                  href="/reels"
                  icon={video}
                  activeIcon={videoActive}
                  label={t("layout.reels")}
                  isActive={isActive("/reels")}
                />
                <NavLink
                  href="/chats"
                  icon={message}
                  activeIcon={messageActive}
                  label={t("layout.message")}
                  isActive={isActive("/chats")}
                />

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
                    color: theme === "dark" ? "white" : "black",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      color: "black",
                    },
                    width: "90%",
                    margin: "0 auto",
                    gap: "10px",
                  }}
                  type="button"
                >
                  {t("layout.notification")}
                </Button>

                <div
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 cursor-pointer dark:hover:text-black"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
                >
                  <AddBoxOutlinedIcon fontSize="medium" />
                  <p className="text-lg">{t("layout.create")}</p>
                </div>
                <CreatePostModal open={open1} onClose={() => setOpen(false)} />

                <div className="flex items-center gap-2 ml-[10%] mt-4">
                  <Image
                    src={info?.image ? `${API}/images/${info.image}` : Profile}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="rounded-full"
                  />

                  <NavLink
                    href="/profile"
                    icon={
                      <Image
                        src={Profile}
                        alt="Profile"
                        width={40}
                        height={40}
                        className={`rounded-full ${
                          pathname === "/profile"
                            ? "border-2 border-black"
                            : ""
                        }`}
                      />
                    }
                    label={t("layout.profile")}
                    isActive={isActive("/profile")}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:text-black mt-8 cursor-pointer">
                {threads}
                <p className="text-lg">{t("layout.threads")}</p>
              </div>

              <div className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 dark:hover:text-black mt-2">
                <button onClick={handleClick} className="flex gap-5" type="button">
                  {setting}
                  <p className="text-lg">{t("layout.more")}</p>
                </button>
                <MenuComp anchorEl={anchorEl} open={open} onClose={handleClose} />
              </div>
            </div>
          </div>
        </section>
      )}

      <div
        style={{
          marginLeft:
            pathname !== "/login" && pathname !== "/registration"
              ? "370px"
              : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
