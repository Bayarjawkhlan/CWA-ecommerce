"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC, Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

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

import { Trash } from "lucide-react";

import { Store } from "@prisma/client";
import { SettingsRequest, SettingsValidator } from "@/libs/validators/settings";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ApiAlert from "@/components/ApiAlert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
  initialData: Store;
}

const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingsRequest>({
    resolver: zodResolver(SettingsValidator),

    defaultValues: initialData,
  });

  const { mutate: updateStore, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: SettingsRequest) => {
      const payload: SettingsRequest = {
        ...values,
      };

      await axios.patch(`/api/stores/${initialData.id}`, payload);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast({
            title: "Login required.",
            description: "You need to be logged in to do that.",
          });
        }

        if (err.response?.status === 400) {
          toast({
            title: "Name is wrong",
            description: err.message,
          });
        }

        toast({
          title: "Something went wrong",
          description: "You could not update store data",
        });
      }
    },

    onSuccess: () => {
      router.refresh();
      toast({
        title: "Success",
        description: "Store updated.",
      });
    },
  });

  const { mutate: deleteStore, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/stores/${initialData.id}`);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast({
            title: "Login required.",
            description: "You need to be logged in to do that.",
          });
        }

        toast({
          title: "Make sure.",
          description: "You removed all products and categories first, ",
        });
      }
    },

    onSuccess: () => {
      router.push("/");
      toast({
        title: "Success",
        description: "Store deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteStore()}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preference" />

        <Button
          disabled={isLoadingUpdate}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => updateStore(e))}
          className="w-full space-y-8"
        >
          <div className="sm:grid-cols-2 md:grid-cols-3 grid  gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingUpdate}
                      placeholder="Store name..."
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
            Save changes
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </Fragment>
  );
};

export default SettingsForm;
