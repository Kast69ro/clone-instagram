"use client";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import Post from "../post/post";
import Saved from "../saved/saved";
import { video } from "@/assets/icon/layout/svg";
import Reels from "../reels/reels";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "center",
          width: {
            xs: "100%",
            sm: "75%",
            md: "80%",
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab
            sx={{ mx: 4 }}
            label={
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[25px] h-[25px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75h4.5v4.5h-4.5v-4.5zM15.75 3.75h4.5v4.5h-4.5v-4.5zM3.75 15.75h4.5v4.5h-4.5v-4.5zM15.75 15.75h4.5v4.5h-4.5v-4.5z"
                  />
                </svg>
                <span className="text-sm font-medium">Posts</span>
              </div>
            }
            {...a11yProps(0)}
          />

          <Tab
            sx={{ mx: 4 }}
            label={
              <div className="flex items-center gap-2 text-blue-600">
                {video} 
                <span className="text-sm font-medium">Reels</span>
              </div>
            }
            {...a11yProps(1)}
          />

          <Tab
            sx={{ mx: 4 }}
            label={
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-[25px] h-[25px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                <span className="text-sm font-medium">Saved</span>
              </div>
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Post />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Reels />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Saved />
      </CustomTabPanel>
    </Box>
  );
}
