"use client";

import { FC, useEffect, useState } from "react";

import PreviewModal from "@/components/modal/PreviewModal";

interface ModalProviderProps {}

const ModalProvider: FC<ModalProviderProps> = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <PreviewModal />
    </>
  );
};

export default ModalProvider;
