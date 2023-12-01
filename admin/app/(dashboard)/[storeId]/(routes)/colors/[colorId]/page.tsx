import { db } from "@/libs/db";

import ColorForm from "./components/ColorForm";

const ColorPage = async ({
  params,
}: {
  params: {
    colorId: string;
  };
}) => {
  let color = null;

  if (params.colorId !== "new") {
    color = await db.color.findFirst({
      where: {
        id: params.colorId,
      },
    });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
