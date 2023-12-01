"use client";

import { FC } from "react";

import { Alert, AlertDescription, AlertTitle } from "./ui/Alert";
import { Badge, BadgeProps } from "./ui/Badge";

import { Copy, ServerIcon } from "lucide-react";
import { Button } from "./ui/Button";
import { toast } from "@/hooks/use-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const ApiAlert: FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Copied",
    });
  };

  return (
    <Alert>
      <ServerIcon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative mr-4 truncate rounded bg-muted px-[5px] py-[3px] font-mono text-sm font-semibold">
          {description}
        </code>

        <Button
          size={"icon"}
          className="aspect-square"
          variant={"outline"}
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
