"use client"

import Skeleton from "@mui/material/Skeleton";

export default function RecommendationSkeleton() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <Skeleton variant="circular" width={40} height={38} />
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={100} height={16} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
      </div>
      <Skeleton variant="rectangular" width={60} height={24} />
    </div>
  );
}
