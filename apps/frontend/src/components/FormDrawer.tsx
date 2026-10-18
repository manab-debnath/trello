import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export interface OrganizationInputs {
  name: string;
  description: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
}

interface FormDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: "create" | "edit";
  organization: Organization | null;
  onSubmit: (values: OrganizationInputs) => Promise<void>;
}

export const FormDrawer = ({
  open,
  setOpen,
  mode,
  organization,
  onSubmit,
}: FormDrawerProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationInputs>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && organization) {
      reset({
        name: organization.name,
        description: organization.description ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [open, mode, organization, reset]);

  const handleFormSubmit = async (values: OrganizationInputs) => {
    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
    });

    reset();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {mode === "create"
              ? "Create New Organization"
              : "Edit Organization"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <form
            id="organization-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="organization-name">Name</Label>
              <Input
                id="organization-name"
                placeholder="Organization name"
                {...register("name", {
                  required: "Organization name is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Name cannot be empty",
                  maxLength: {
                    value: 100,
                    message: "Name cannot exceed 100 characters",
                  },
                })}
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="organization-description">Description</Label>
              <Textarea
                id="organization-description"
                placeholder="Describe your organization"
                className="h-32 resize-none"
                maxLength={250}
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Description cannot be empty",
                  maxLength: {
                    value: 250,
                    message: "Description cannot exceed 100 characters",
                  },
                })}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            form="organization-form"
            disabled={isSubmitting}
            className="h-9 cursor-pointer"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
                ? "Create Organization"
                : "Save Changes"}
          </Button>

          <DrawerClose
            render={
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            }
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
