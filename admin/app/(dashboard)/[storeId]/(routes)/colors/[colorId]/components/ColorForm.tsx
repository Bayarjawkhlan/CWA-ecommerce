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

import { Color } from "@prisma/client";
import { ColorRequest, ColorValidator } from "@/libs/validators/colors";

interface ColorFormProps {
  initialData: Color | null;
}

const ColorForm: FC<ColorFormProps> = ({ initialData }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<ColorRequest>({
    resolver: zodResolver(ColorValidator),

    defaultValues: initialData || {
      name: "",
      value: "#",
    },
  });

  const title = initialData ? "Edit your color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData ? "Edited color" : "color Created";
  const action = initialData ? "Save changes" : "Create";

  const { mutate: updateColor, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: ColorRequest) => {
      const payload: ColorRequest = {
        ...values,
      };

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          payload,
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, payload);
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
      router.push(`/${params.storeId}/colors`);

      toast({
        title: "Success",
        description: toastMessage,
      });
    },
  });

  const { mutate: deleteColor, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
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
            title: "Change color name",
            description: "Already have a color with this name",
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
      router.push(`/${params.storeId}/colors`);
      toast({
        title: "Success",
        description: "Color deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteColor()}
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
          onSubmit={form.handleSubmit((e) => updateColor(e))}
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
                      placeholder="Color name..."
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={isLoadingUpdate}
                        placeholder="Color value..."
                        {...field}
                      />
                      <div
                        className="rounded-full border p-4"
                        style={{
                          backgroundColor: field.value,
                        }}
                      />
                    </div>
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

export default ColorForm;
