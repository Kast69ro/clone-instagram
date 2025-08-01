"use client";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useDrawerNotification } from "@/store/notification/notificationStore";
import { Avatar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TemporaryDrawerNotif() {
  const {
    openNotifDrawer,
    toggleDrawerNotif,
    data,
    getUsers,
    following,
    unfollowing,
    loading,
    closeDrawer,
  } = useDrawerNotification();

  const [followedIds, setFollowedIds] = useState([]);

  useEffect(() => {
    if (openNotifDrawer) {
      getUsers();
    }
  }, [openNotifDrawer]);

  const handleFollowToggle = (userId) => {
    if (followedIds.includes(userId)) {
      unfollowing(userId);
      setFollowedIds((prev) => prev.filter((id) => id !== userId));
    } else {
      following(userId);
      setFollowedIds((prev) => [...prev, userId]);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 400 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
          Уведомления
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          В этом месяце
        </Typography>
        <List>
          {data.map((notif) => (
            <ListItem key={notif.id} disablePadding sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Link href={`/profile/${notif.id}`} onClick={closeDrawer}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      mr: 2,
                      bgcolor: "grey.300",
                    }}
                  >
                    {notif.avatar}
                  </Avatar>
                </Link>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
                    <Link href={`/profile/${notif.id}`} onClick={closeDrawer}>
                      <Typography
                        component="span"
                        fontWeight="bold"
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {notif.fullName}
                      </Typography>
                    </Link>
                    <br /> подписался(- <br /> ась) на ваши <br /> обновления.
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {notif.date || ""}
                    </Typography>
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleFollowToggle(notif.id)}
                  sx={{
                    textTransform: "none",
                    bgcolor: followedIds.includes(notif.id)
                      ? "grey.300"
                      : "#0095F6",
                    color: followedIds.includes(notif.id)
                      ? "black"
                      : "white",
                    fontWeight: followedIds.includes(notif.id)
                      ? 600
                      : 400,
                    "&:hover": {
                      bgcolor: followedIds.includes(notif.id)
                        ? "grey.400"
                        : "#007acc",
                    },
                    width: followedIds.includes(notif.id)
                      ? "160px"
                      : "175px",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                    textAlign: "center",
                  }}
                >
                  {followedIds.includes(notif.id)
                    ? "Подписки"
                    : "Подписаться в ответ"}
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      open={openNotifDrawer}
      onClose={toggleDrawerNotif}
      anchor="left"
      PaperProps={{
        sx: {
          left: "43px",
          width: "420px",
          top: 0,
          height: "100vh",
          position: "fixed",
          boxShadow: 3,
        },
      }}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          sx: {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}
