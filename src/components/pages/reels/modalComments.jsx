"use client"

import React from "react"
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material"
import { X, Heart, Smile } from "lucide-react"

const comments = [
  {
    id: "1",
    username: "s4nn__10",
    time: "2 нед.",
    text: "Respect Vini 👏",
    likes: 9241,
    repliesCount: 6,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    username: "mr_yahya007",
    time: "2 нед.",
    text: "Yamal hate Button he is a very over confidence 🙄",
    likes: 2891,
    repliesCount: 29,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    username: "cr7_________938",
    time: "1 нед.",
    text: "Great post! 🔥",
    likes: 1500,
    repliesCount: 10,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    username: "user_example",
    time: "3 дн.",
    text: "So true! 🙌",
    likes: 500,
    repliesCount: 2,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    username: "another_user",
    time: "1 дн.",
    text: "Love this! ❤️",
    likes: 300,
    repliesCount: 0,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "6",
    username: "coding_fan",
    time: "5 ч.",
    text: "This UI looks amazing! ✨",
    likes: 120,
    repliesCount: 1,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "7",
    username: "design_guru",
    time: "2 ч.",
    text: "Clean and functional. Well done! 👍",
    likes: 80,
    repliesCount: 0,
    avatarSrc: "/placeholder.svg?height=32&width=32",
  },
]

export default function CommentsPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          height: "600px",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <IconButton aria-label="close">
            <X size={20} />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
            Комментарии
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Placeholder for alignment */}
        </Box>

        {/* Comments List */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, py: 1 }}>
          <List disablePadding>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                  <ListItemAvatar sx={{ minWidth: 48 }}>
                    <Avatar alt={comment.username} src={comment.avatarSrc} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography component="span" variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {comment.username}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {comment.time}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "block", mt: 0.5 }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.text}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Отметки "Нравится": {comment.likes.toLocaleString()}
                          </Typography>
                          <Link href="#" variant="caption" color="text.secondary" underline="none">
                            Ответить
                          </Link>
                        </Stack>
                        {comment.repliesCount > 0 && (
                          <Link
                            href="#"
                            variant="caption"
                            color="text.secondary"
                            underline="none"
                            sx={{ mt: 1, display: "block" }}
                          >
                            Смотреть все ответы ({comment.repliesCount})
                          </Link>
                        )}
                      </React.Fragment>
                    }
                  />
                  <IconButton aria-label="like" size="small" sx={{ alignSelf: "flex-start", mt: 0.5 }}>
                    <Heart size={16} />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" sx={{ ml: 6 }} />
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Comment Input */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar alt="User Avatar" src="/placeholder.svg?height=32&width=32" sx={{ width: 32, height: 32 }} />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Добавьте комментарий..."
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label="add emoji" edge="end">
                    <Smile size={20} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 50, pr: 0.5 }, // Apply border radius to the input field
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 50, // Ensure the border radius is applied to the root of the input
                paddingRight: "8px", // Adjust padding to make space for the icon button
              },
            }}
          />
        </Box>
      </Paper>
    </main>
  )
}
