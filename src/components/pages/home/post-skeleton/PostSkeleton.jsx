"use client"

import Skeleton from "@mui/material/Skeleton";


export default function PostSkeleton() {
  return (
    <div className="w-full sm:w-[620px] flex flex-col gap-3 border-b border-[#f0f0f0] pb-2">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={120} height={18} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
      <Skeleton variant="rectangular" height={614} className="rounded-[10px]" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

