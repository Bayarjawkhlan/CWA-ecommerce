"use client";

import { FC } from "react";

import { Loader2 } from "lucide-react";

interface ButtonLoaderProps {
  isLoading: boolean;
}

const ButtonLoader: FC<ButtonLoaderProps> = ({ isLoading }) => {
  if (isLoading) {
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
  } else {
    return null;
  }
};

export default ButtonLoader;
