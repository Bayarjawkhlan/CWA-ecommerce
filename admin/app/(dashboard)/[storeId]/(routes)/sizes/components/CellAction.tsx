import { FC, Fragment, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownmeMenu";
import AlertModal from "@/components/modals/AlertModal";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { SizeColumn } from "./Columns";

interface CellActionProps {
  data: SizeColumn;
}

export const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast({
      description: "Size id copied to the clipboard.",
    });
  };

  const onEdit = () => {
    router.push(`/${params.storeId}/sizes/${data.id}`);
  };

  const onDelete = () => {
    setOpen(true);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast({
            title: "Login required.",
            description: "You need to be logged in to do that.",
            variant: "destructive",
          });
        }

        toast({
          title: "Make sure.",
          description: "You removed all products using this color first.",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      setOpen(false);
      router.refresh();

      toast({
        title: "Success",
        description: "Size deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={mutate}
        loading={isLoading}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};
