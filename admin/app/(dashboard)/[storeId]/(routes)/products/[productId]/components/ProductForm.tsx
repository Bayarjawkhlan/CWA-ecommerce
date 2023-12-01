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
  FormDescription,
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

import { Category, Color, Product, Size } from "@prisma/client";
import { ProductRequest, ProductValidator } from "@/libs/validators/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

interface ProductFormProps {
  initialData: Product | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<ProductRequest>({
    resolver: zodResolver(ProductValidator),

    defaultValues: initialData || {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      sizeId: "",
      colorId: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  const title = initialData ? "Edit your product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Edited product" : "product Createe";
  const action = initialData ? "Save changes" : "Create";

  const { mutate: updateProduct, isLoading: isLoadingUpdate } = useMutation({
    mutationFn: async (values: ProductRequest) => {
      const payload: ProductRequest = {
        ...values,
      };

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          payload,
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, payload);
      }
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
            title: "Label is wrong",
            description: err.message,
            variant: "destructive",
          });
        }

        if (err.response?.status === 409) {
          toast({
            title: "Change product name",
            description: "Already have a product with this name",
            variant: "destructive",
          });
        }

        toast({
          title: "Something went wrong",
          description: "You could not update product data",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.refresh();
      router.push(`/${params.storeId}/products`);

      toast({
        title: "Success",
        description: toastMessage,
      });
    },
  });

  const { mutate: deleteProduct, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
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
          title: "Something went wrong",
          description:
            "You could not delete this product.please try again later.",
          variant: "destructive",
        });
      }
    },

    onSuccess: () => {
      router.push(`/${params.storeId}/products`);
      toast({
        title: "Success",
        description: "Product deleted.",
      });
    },
  });

  return (
    <Fragment>
      <AlertModal
        isOpen={open}
        loading={isLoadingDelete}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteProduct()}
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
          onSubmit={form.handleSubmit((e) => updateProduct(e))}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((value) => value !== url),
                      ])
                    }
                    disabled={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoadingUpdate}
                      placeholder="Product name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoadingUpdate}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoadingDelete || isLoadingUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a category"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isLoadingDelete || isLoadingUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a size..."
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isLoadingDelete || isLoadingUpdate}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a color..."
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(bool) => field.onChange(bool)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>

                    <FormDescription>
                      This product appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(bool) => field.onChange(bool)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>

                    <FormDescription>
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
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

export default ProductForm;
