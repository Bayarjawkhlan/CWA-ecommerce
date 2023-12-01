"use client";

import StoreModal from "@/components/modals/StoreModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [IsMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!IsMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProvider;
