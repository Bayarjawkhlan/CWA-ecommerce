import { format } from "date-fns";
import { db } from "@/libs/db";

import { SizeColumn } from "./components/Columns";
import SizeClient from "./components/SizeClient";

const SizesPage = async ({
  params,
}: {
  params: {
    storeId: string;
  };
}) => {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: { createdAt: "desc" },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do,yyyy"),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
