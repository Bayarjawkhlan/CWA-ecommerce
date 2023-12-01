"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC, Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";

import Heading from "@/components/Heading";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import ButtonLoader from "@/components/ButtonLoader";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ImageUpload";

import { Trash } from "lucide-react";

import { Billboard } from "@prisma/client";
import {
  BillboardRequest,
  BillboardValidator,
} from "@/libs/validators/billboards";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const BillboardForm: FC<BillboardFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<BillboardRequest>({
    resolver: zodResolver(BillboardValidator),

    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const title = initialData ? "Edit your billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Edited Billboard" : "Billboard Createe";
  const action = initialData ? "Save changes" : "Create";

  const { mutate: updateBillboard, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: BillboardRequest) => {
      const payload: BillboardRequest = {
        ...values,
      };

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          payload,
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, payload);
      }
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

        if (err.response?.status === 400) {
          toast({
            title: "Label is wrong",
            description: err.message,
            variant: "destructive",
          });
        }

        if (err.response?.status === 409) {
          toast({
            title: "Change billboard label",
            description: "Already have a billboard with this label",
            variant: "destructive",
          });
        }

        toast({
          title: "Something went wrong",
          description: "You could not update billboard data",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/billboards`);

      toast({
        title: "Success",
        description: toastMessage,
      });
    },
  });

  const { mutate: deleteBillboard, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
      );
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
          description: "You removed all categories using this billboard first.",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Success",
        description: "Billboard deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteBillboard()}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData ? (
          <Button
            disabled={isLoadingUpdate}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => updateBillboard(e))}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    disabled={isLoadingUpdate}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-8 sm:grid-cols-2  md:grid-cols-3">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingUpdate}
                      placeholder="Billboard label..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoadingUpdate} className="ml-auto" type="submit">
            <ButtonLoader isLoading={isLoadingUpdate} />
            {action}
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default BillboardForm;
