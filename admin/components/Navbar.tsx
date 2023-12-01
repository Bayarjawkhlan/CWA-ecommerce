import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/libs/db";

import MainNavbar from "./MainNavbar";
import StoreSwitcher from "./StoreSwitcher";
import ModeToggle from "./ThemeToggle";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />

        <MainNavbar className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
