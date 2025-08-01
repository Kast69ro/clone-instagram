"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Menu, MenuItem, Tooltip, tooltipClasses } from "@mui/material";
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
import { jwtDecode } from "jwt-decode";
import { API } from "@/utils/config";
import { useDrawerStore } from "@/store/search/searchStore";
import CreatePostModal from "@/components/createPost/createpost";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Profiles from "@/components/pages/profile/profile/profile";
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
  const { openNotifDrawer, toggleDrawerNotif, openDrawerNotifFunc} =
	  useDrawerNotification();
  const { getInfo, info } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();
  // const [anchorEl, setAnchorEl] = (useState < null) | (HTMLElement > null)
  // const open = Boolean(anchorEl)
  const { t } = useTranslation();

  const [open1, setOpen] = useState(false);
  // const handleClick = event => setAnchorEl(event.currentTarget)
  // const handleClose = () => setAnchorEl(null)

  const renderIcon = (path, activeIcon, inactiveIcon) => {
    return pathname === path ? activeIcon : inactiveIcon;
  };
  useEffect(() => {
    const rawToken = localStorage.getItem("access_token");
    if (rawToken) {
      try {
        const decode = jwtDecode(rawToken);
        getInfo(decode.sid);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const [token, setToken] = useState(null);
  const theme = localStorage.getItem("theme");

  let isAuthPage = pathname === "/login" || pathname === "/registration";
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    setToken(accessToken);

    if (!accessToken && pathname !== "/login" && pathname !== "/registration") {
      router.push("/login");
    }
  }, [pathname, router]);

  return (
    <div className="flex">
      {!isAuthPage && (
        <section
          className="flex justify-center w-[50px] border-r-[2px] border-[#eee] h-[100vh]"
          style={{
            marginRight: pathname === "/chats" || !isOpen ? "0px" : "320px",
          }}
        >
          <div className="sideBar h-full pb-[100px]">
            <div className="m-auto flex justify-center pb-[10px] mt-[20px]">
              {instagramMiniLogo}
            </div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-[0.5rem] mt-4">
                {/* Home Icon */}
                <LightTooltip title={t("layout.home")} placement="right" arrow>
                  <Link href="/" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                      {renderIcon("/", homeIconActive, homeIcon)}
                    </div>
                  </Link>
                </LightTooltip>

                <button
                  onClick={openDrawer}
                  className="w-full flex items-center justify-start px-3 py-3 rounded-lg text-black "
                  style={{ color: theme == "dark" ? "white" : "black" }}
                >
                  {searchIconActive}
                  {/* {t('layout.search')} */}
                </button>

                {/* Explore Icon */}
                <LightTooltip
                  title={t("layout.explore")}
                  placement="right"
                  arrow
                >
                  <Link href="/explore" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                      {renderIcon("/explore", compasActive, compas)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Reels Icon */}
                <LightTooltip title={t("layout.reels")} placement="right" arrow>
                  <Link href="/reels" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                      {renderIcon("/reels", videoActive, video)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Messages Icon */}
                <LightTooltip
                  title={t("layout.message")}
                  placement="right"
                  arrow
                >
                  <Link href="/chats" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                      {renderIcon("/chats", messageActive, message)}
                    </div>
                  </Link>
                </LightTooltip>

                {/* Notifications Icon */}
                {/* <LightTooltip
									title={t('layout.notification')}
									placement='right'
									arrow
								>
									<div className='flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center'>
										{renderIcon('/notification', likeActive, like)}
									</div>
								</LightTooltip> */}



                <button
                  onClick={openDrawerNotifFunc}
                  className="w-full flex items-center justify-start px-3 py-3 rounded-lg text-black "
                >
                  {like}
                  {/* {t('layout.search')} */}
                </button>





                {/* Create Icon */}
                <LightTooltip
                  title={t("layout.create")}
                  placement="right"
                  arrow
                >
                  <div
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-4 w-[90%] m-auto rounded-md h-[52px] px-4 hover:bg-gray-100 cursor-pointer"
                  >
                    <AddBoxOutlinedIcon
                      sx={{ color: "black" }}
                      fontSize="medium"
                    />
                    {/* <p className='text-lg'>{t('layout.create')}</p> */}
                  </div>
                  <CreatePostModal
                    open={open1}
                    onClose={() => setOpen(false)}
                  />
                </LightTooltip>

                {/* Profile Icon */}
                <LightTooltip
                  title={t("layout.profile")}
                  placement="right"
                  arrow
                >
                  <Link href="/profile" passHref>
                    <div className="flex items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
                      <img
                        className={`rounded-[50%] h-[25] w-[25] ml-[10%] ${
                          router.pathname === "/profile"
                            ? "border-2 border-black"
                            : ""
                        }`}
                        src={
                          info?.image ? `${API}/images/${info.image}` : Profile
                        }
                        alt="Profile"
                      />
                    </div>
                  </Link>
                </LightTooltip>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="ml-[0px] w-[100%]">{children}</div>
    </div>
  );
};

export default MiniSideBar;

// <Menu
// id="fade-button"
// sx={{
// 	padding: 0,
// 	borderRadius: '10px',
// 	'.MuiPaper-root': {
// 		borderRadius: '16px',
// 		width: '300px',
// 		height: '475px',
// 		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
// 	},
// }}
// anchorEl={anchorEl}
// open={open}
// onClose={handleClose}
// anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// transformOrigin={{ vertical: 'top', horizontal: 'center' }}
// >
// <div className="pb-[10px] bg-[#fff] dark:text-white dark:bg-[#262626] rounded-[16px] shadow-lg p-[10px] border-[1px] w-[300px] h-[475px]">
// 	<div className="flex flex-col gap-[7px]">
// 		<Link href="/setting" passHref>
// 			<MenuItem
// 				sx={{
// 					padding: '16px',
// 					display: 'flex',
// 					gap: '10px',
// 					borderRadius: '8px',
// 				}}
// 			>
// 				{setting}
// 				<p>{t('layout.mores.setting')}</p>
// 			</MenuItem>
// 		</Link>
// 		{/* Add more MenuItems here */}
// 	</div>
// </div>
// </Menu>
{
  /* Threads and More */
}

{
  /* <div className="flex flex-col items-center super-svg gap-4 w-[90%] rounded-[8px] h-[52px] px-0 justify-center">
<LightTooltip title={t('layout.threads')} placement="right" arrow>
  <button onClick={handleClick} className="flex gap-5">
	 {threads}
  </button>
</LightTooltip>
<LightTooltip title={t('layout.more')} placement="right" arrow>
  <button onClick={handleClick} className="flex gap-5">
	 {settings}
  </button>
</LightTooltip>


</div> */
}
