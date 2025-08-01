"use client";

import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { QRCodeCanvas } from "qrcode.react";

export default function QrCodeModal({ open, onClose }) {
  const { info } = useProfileStore();
  

  const qrValue = info
    ? `User Name: ${info.userName}\nfirts name: ${info.firstName}\ngender: ${info.gender}\nAbout: ${info.about}`
    : "";

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 280,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ alignSelf: "flex-end", mb: 1 }}
          aria-label="close"
        >
          <X />
        </IconButton>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Ваш QR-код
        </Typography>
        <QRCodeCanvas value={qrValue} size={200} />
      </Box>
    </Modal>
  );
}
