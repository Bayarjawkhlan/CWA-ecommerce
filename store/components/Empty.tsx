"use client";

import { FC } from "react";

interface EmptyProps {}

const Empty: FC<EmptyProps> = () => {
  return (
    <div className="flex h-full w-full items-center justify-center text-neutral-500">
      No results found
    </div>
  );
};

export default Empty;
