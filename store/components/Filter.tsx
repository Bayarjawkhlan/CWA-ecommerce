"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FC } from "react";
import qs from "query-string";
import { cn } from "@/libs/utils";

import { Separator } from "./ui/separator";
import { Button } from "./ui/Button";

import { Color, Size } from "@/types/types";

interface FilterProps {
  valueKey: string;
  name: string;
  data: (Size | Color)[];
}

const Filter: FC<FilterProps> = ({ valueKey, name, data }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true },
    );

    router.push(url);
  };

  return (
    <div className="mb-8 ">
      <h3 className="text-lg font-semibold">{name}</h3>

      <Separator className="my-4" />

      <div className="flex flex-wrap gap-2">
        {data.map((item) => (
          <div className="flex items-center" key={item.id}>
            <Button
              className={cn(
                "rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 hover:opacity-75",
                selectedValue === item.id && "bg-black text-white",
              )}
              size={"none"}
              variant={"none"}
              onClick={() => onClick(item.id)}
            >
              {item.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
