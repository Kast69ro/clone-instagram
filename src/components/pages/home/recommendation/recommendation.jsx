"use client";

import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import Image from "next/image";
import { Box, Button, TextField, Dialog, DialogContent, IconButton, InputAdornment } from "@mui/material";
import Link from "next/link";
import { useUser } from "@/store/pages/home/home";
import { Fragment, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import instagram from "../../../../assets/img/pages/home/instagram.png";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import RecommendationSkeleton from "../recommendation-skeleton/recommendation-skeleton";
import { API } from "@/utils/config";

export default function Recommendation() {
  const { info } = useProfileStore();
  const { getUsers, users } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Profile section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-3 items-center">
          <Link href={`/profile`}>
            <Image
              src={info?.image ? `${API}/images/${info.image}` : "/ava.jpeg"}
              alt="profile image"
              className="rounded-full object-cover"
              width={40}
              height={40}
            />
          </Link>

          <div className="flex flex-col gap-1">
            <Link href={`/profile`}>
              <p className="text-sm leading-tight cursor-pointer font-bold">
                {info?.userName}
              </p>
            </Link>
            <p className="text-sm text-[#737373] leading-tight">{info?.firstName}</p>
          </div>
        </div>

        <button
          onClick={handleClickOpen}
          className="text-blue-500 text-sm font-semibold hover:underline"
        >
          Switch
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#737373] font-semibold">Suggested for you</p>
          <p className="text-sm text-black cursor-pointer hover:underline">See All</p>
        </div>

        <div className="flex flex-col gap-3">
          {users.length === 0
            ? Array.from({ length: 5 }).map((_, idx) => (
                <RecommendationSkeleton key={idx} />
              ))
            : users.map((user) => (
                <div key={user.id} className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <Link href={`/profile/${user.id}`}>
                      <Image
                        src={user?.avatar ? `${API}/images/${user.avatar}` : "/ava.jpeg"}
                        alt="profile avatar"
                        className="rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                    </Link>

                    <div className="flex flex-col gap-1">
                      <Link href={`/profile/${user.id}`}>
                        <p className="text-sm font-medium hover:underline cursor-pointer">
                          {user?.userName}
                        </p>
                      </Link>
                      <p className="text-[13px] text-[#737373] leading-tight">
                        {user?.fullName}
                      </p>
                    </div>
                  </div>

                  <button className="text-blue-500 text-sm font-semibold hover:underline">
                    Follow
                  </button>
                </div>
              ))}
        </div>
      </div>

      {/* Switch Account Dialog */}
      <Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className="flex flex-col gap-5 w-[450px] h-[450px]">
            <Box onClick={handleClose} className="flex justify-end cursor-pointer">
              <CloseIcon />
            </Box>

            <Box className="flex justify-center items-center">
              <Image
                src={instagram}
                width={130}
                height={70}
                alt="instagram logo"
              />
            </Box>

            <Box className="flex flex-col gap-4">
              <Box
                component="form"
                sx={{ "& > :not(style)": { m: 1, width: "43ch" } }}
                noValidate
                autoComplete="off"
                className="flex flex-col"
              >
                <TextField
                  id="username"
                  label="Phone number, username or email"
                  variant="outlined"
                  value={info?.userName || name}
                  onChange={({ target }) => setName(target.value)}
                />
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box className="flex items-center gap-2 pl-2">
                <input type="checkbox" id="save-login" />
                <label htmlFor="save-login">Save login info</label>
              </Box>

              <Box className="flex flex-col gap-3 mx-[10px]">
                <Button variant="contained">Log in</Button>
                <Button variant="outlined">Forgot password</Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Fragment>
    </div>
  );
}
