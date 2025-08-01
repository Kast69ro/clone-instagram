"use client";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useProfileStore } from "@/store/pages/profile/profile/store-profile";
import { API } from "@/utils/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditProfile() {
  const { info, editAvatar, editProfil } = useProfileStore();

  const router = useRouter();

  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState([]);
  const [gender, setGender] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


const [originalAbout, setOriginalAbout] = useState("");
const [originalGender, setOriginalGender] = useState("");
const [originalImage, setOriginalImage] = useState("");


 useEffect(() => {
  setName(info?.firstName);
  setUserName(info?.userName);
  setGender(info?.gender == "Male" ? 1 : 0);
  setAbout(info?.about);
  setAvatar(info?.image);

  setOriginalAbout(info?.about);
  setOriginalGender(info?.gender == "Male" ? 1 : 0);
  setOriginalImage(info?.image);
}, [info]);


 const handleSaveEdit = async (e) => {
  e.preventDefault();

  const photoChanged = typeof avatar !== "string" && avatar?.length > 0;
  const aboutChanged = about !== originalAbout;
  const genderChanged = +gender !== +originalGender;

  if (photoChanged) {
    const formData = new FormData();
    formData.append("imageFile", avatar[0]);
    await editAvatar(formData);
  }

  if (aboutChanged || genderChanged) {
    await editProfil({ about, gender: +gender });
  }

  if (photoChanged || aboutChanged || genderChanged) {
    router.push("/profile");
  } else {
    setModalOpen(false);
  }
};



  return (
    <Box className="min-h-screen flex justify-center items-center  p-6">
      <Box className="w-full max-w-3xl  rounded-lg shadow-md p-8 bg-white">
        <Box className="flex items-center text-base font-medium text-gray-700 mb-6">
          <Link href='/profile'>
          <span className="text-blue-600 cursor-pointer">Profile</span>
          </Link>
          <ArrowForwardIosIcon sx={{ fontSize: 16, mx: 1 }} />
          <span className="font-semibold text-black text-lg">Edit profile</span>
        </Box>

        <Box className="flex items-center justify-between bg-gray-100 p-6 rounded-xl mb-6">
          <Box className="flex items-center gap-5">
            <Avatar
              src={`${API}/images/${info?.image}`}
              alt="profile"
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography className="font-bold text-lg">{name}</Typography>
              <Typography className="text-sm text-gray-600">
                {userName}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => setModalOpen(true)}
            variant="contained"
            className="bg-gray-200 text-black text-base normal-case shadow-none px-6 py-2"
          >
            Change photo
          </Button>
        </Box>

        <Box component="form" className="flex flex-col gap-6">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            defaultValue="Terry Lucas"
            size="medium"
            value={name}
          />
          <TextField
            label="User name"
            variant="outlined"
            fullWidth
            defaultValue="terrylucas"
            size="medium"
            value={userName}
          />
          <TextField
            label="About"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            size="medium"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
          <Select
            displayEmpty
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            fullWidth
            size="medium"
          >
            <MenuItem disabled value="">
              Gender
            </MenuItem>
            <MenuItem value="1">Male</MenuItem>
            <MenuItem value="0">Female</MenuItem>
          </Select>
          <Typography className="text-sm text-gray-500 -mt-1">
            This won't be part of your public profile.
          </Typography>

          <Button
            onClick={handleSaveEdit}
            type="submit"
            variant="contained"
            sx={{
              width: "auto",
              px: 5,
              py: 1.5,
              textTransform: "capitalize",
              boxShadow: "none",
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              backgroundColor: "#1976d2",
              mx: "auto",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Submit
          </Button>
        </Box>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          className="flex justify-center items-center"
        >
          <Box className="bg-white p-8 rounded-xl shadow-xl w-96 flex flex-col items-center">
            <Typography
              variant="h6"
              className="mb-6 font-semibold text-center text-gray-900"
            >
              Upload New Photo
            </Typography>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAvatar(e.target.files); 
                setModalOpen(false);
              }}
              className="mb-6 w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-700
               file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
               file:text-sm file:font-semibold file:bg-blue-600 file:text-white
               hover:file:bg-blue-700
               focus:outline-none focus:ring-2 focus:ring-blue-500 mt-[5%]"
            />

            <Button
              onClick={() => setModalOpen(false)}
              fullWidth
              variant="outlined"
              className="py-2"
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}
