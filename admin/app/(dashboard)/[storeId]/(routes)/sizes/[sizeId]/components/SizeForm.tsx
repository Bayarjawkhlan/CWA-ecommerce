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

import { Trash } from "lucide-react";

import { Size } from "@prisma/client";
import { SizeRequest, SizeValidator } from "@/libs/validators/sizes";

interface SizeFormProps {
  initialData: Size | null;
}

const SizeForm: FC<SizeFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<SizeRequest>({
    resolver: zodResolver(SizeValidator),

    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const title = initialData ? "Edit your size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "Edited size" : "size Created";
  const action = initialData ? "Save changes" : "Create";

  const { mutate: updateSize, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: SizeRequest) => {
      const payload: SizeRequest = {
        ...values,
      };

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          payload,
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, payload);
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
            title: "Name is wrong",
            description: err.message,
            variant: "destructive",
          });
        }

        toast({
          title: "Something went wrong",
          description: "You could not update size data",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/sizes`);

      toast({
        title: "Success",
        description: toastMessage,
      });
    },
  });

  const { mutate: deleteSize, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
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

        if (err.response?.status === 409) {
          toast({
            title: "Change size name",
            description: "Already have a size with this name",
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
      router.push(`/${params.storeId}/sizes`);
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
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteSize()}
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
          onSubmit={form.handleSubmit((e) => updateSize(e))}
          className="w-full space-y-8"
        >
          <div className="grid gap-8 sm:grid-cols-2  md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingUpdate}
                      placeholder="Size name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingUpdate}
                      placeholder="Size value..."
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

export default SizeForm;
