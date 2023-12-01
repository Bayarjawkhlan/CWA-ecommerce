"use client";

import { FC, MouseEventHandler } from "react";
import { cn } from "@/libs/utils";

interface IconButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  icon: React.ReactElement;
}

const IconButton: FC<IconButtonProps> = ({ onClick, className, icon }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full border bg-white p-2 shadow-md transition hover:scale-110",
        className,
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
