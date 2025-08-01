"use client";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState } from "react";
import Saved from "../saved/saved";
import PostById from "../post-by-id/post";
import ReelsById from "../reels-by-id/reels-by-id";
import { video } from "@/assets/icon/layout/svg";

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

export default function BasicTabsById({id}) {
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
            sx={{ mx:2 }} 
            label={
              <div className="flex items-center gap-2 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
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
            sx={{ mx: 2 }}
            label={
              <div className="flex items-center gap-2 text-blue-600">
                {video} 
                <span className="text-sm font-medium">Reels</span>
              </div>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <PostById id={id}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ReelsById id={id}/>
      </CustomTabPanel>
    </Box>
  );
}
