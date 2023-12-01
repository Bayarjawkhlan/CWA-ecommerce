"use client";

import { FC } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

import Modal from "./Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

import { StoreRequest, StoreValidator } from "@/libs/validators/store";
import { Store } from "@prisma/client";
import ButtonLoader from "../ButtonLoader";

const StoreModal: FC = () => {
  const storeModal = useStoreModal();
  const router = useRouter();

  const form = useForm<StoreRequest>({
    resolver: zodResolver(StoreValidator),

    defaultValues: {
      name: "",
    },
  });

  const { mutate: onSubmit, isLoading } = useMutation({
    mutationFn: async ({ name }: StoreRequest) => {
      const payload: StoreRequest = {
        name,
      };

      //Create store
      const { data } = await axios.post("/api/stores", payload);

      return data;
    },

    onSuccess: (data: Store) => {
      storeModal.onClose();
      router.push(`/${data.id}`);

      toast({
        title: "Store created",
      });
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "Store name at least 2 charecter",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Something went wrong",
      });
    },
  });

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={() => storeModal.onClose()}
    >
      <div className="">
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((e) => onSubmit(e))}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end space-x-2 pt-6">
                <Button
                  variant={"outline"}
                  onClick={() => storeModal.onClose()}
                  type="button"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button isLoading={isLoading} disabled={isLoading}>
                  <ButtonLoader isLoading={isLoading} />
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
