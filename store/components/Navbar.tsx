import getCategories from "@/actions/getCategories";
import Link from "next/link";

import MainNavbar from "./MainNavbar";
import Container from "./Container";
import NavbarActions from "./NavbarActions";

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <div className="border-b">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href={"/"} className="ml-4 flex gap-x-2 lg:ml-0">
            <p className="text-xl font-bold">Store</p>
          </Link>

          <MainNavbar data={categories} />

          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
