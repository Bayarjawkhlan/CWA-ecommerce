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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import { Trash } from "lucide-react";

import { Billboard, Category } from "@prisma/client";
import {
  CategoryRequest,
  CategoryValidator,
} from "@/libs/validators/categories";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const CategoryForm: FC<CategoryFormProps> = ({ initialData, billboards }) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<CategoryRequest>({
    resolver: zodResolver(CategoryValidator),

    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const title = initialData ? "Edit your category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData ? "Edited category" : "Category Created";
  const action = initialData ? "Save changes" : "Create";

  const { mutate: updateCategory, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: CategoryRequest) => {
      const payload: CategoryRequest = {
        ...values,
      };

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          payload,
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, payload);
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

        if (err.response?.status === 408) {
          toast({
            title: "Something went wrong",
            description: "Category not found",
            variant: "destructive",
          });
        }

        if (err.response?.status === 409) {
          toast({
            title: "Change category name",
            description: "Already have a category with this name",
            variant: "destructive",
          });
        }

        toast({
          title: "Something went wrong",
          description: "You could not update category data",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/categories`);

      toast({
        title: "Success",
        description: toastMessage,
      });
    },
  });

  const { mutate: deleteCategory, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
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

        if (err.response?.status === 409) {
          toast({
            title: "Change category name",
            description: "Already have a category with this name",
            variant: "destructive",
          });
        }

        toast({
          title: "Make sure.",
          description: "You removed all products using this category first.",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.push(`/${params.storeId}/categories`);
      toast({
        title: "Success",
        description: "Category deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteCategory()}
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
          onSubmit={form.handleSubmit((e) => updateCategory(e))}
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
                      placeholder="Category name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoadingDelete || isLoadingUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
