import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SessionData = typeof authClient.$Infer.Session;
type User = SessionData["user"];

type ProfileInputs = {
  name: string;
};

type PasswordInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type DeleteInputs = {
  password: string;
};

export default function Profile() {
  const navigate = useNavigate();

  const {
    data: session,
    isPending: sessionPending,
    refetch,
  } = authClient.useSession();

  const user: User | null = session?.user ?? null;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileInputs>({
    defaultValues: {
      name: "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordInputs>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Delete account form
  const deleteForm = useForm<DeleteInputs>({
    defaultValues: {
      password: "",
    },
  });

  // Populate the profile form when the session loads.
  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      name: user.name ?? "",
    });
  }, [user, profileForm.reset]);

  // Update name
  const onProfileSubmit = async (values: ProfileInputs) => {
    const name = values.name.trim();

    if (!name) {
      profileForm.setError("name", {
        type: "manual",
        message: "Name cannot be empty",
      });
      return;
    }

    const { error } = await authClient.updateUser({ name });

    if (error) {
      toast.add({
        type: "error",
        description: error.message || "Failed to update profile.",
      });
      return;
    }

    await refetch();

    toast.add({
      type: "success",
      description: "Profile updated successfully.",
    });
  };

  // Change password
  const onPasswordSubmit = async (values: PasswordInputs) => {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.add({
        type: "error",
        description: error.message || "Failed to change password.",
      });
      return;
    }

    passwordForm.reset();

    toast.add({
      type: "success",
      description: "Password changed successfully.",
    });
  };

  // Delete account
  const onDeleteSubmit = async (values: DeleteInputs) => {
    const { error } = await authClient.deleteUser({
      password: values.password,
    });

    if (error) {
      toast.add({
        type: "error",
        description: error.message || "Failed to delete account.",
      });
      return;
    }

    setDeleteDialogOpen(false);
    deleteForm.reset();

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login", { replace: true });
        },
      },
    });

    navigate("/login", { replace: true });
  };

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-4 py-10 md:p-8">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal information and account security.
        </p>
      </div>

      {/* Personal information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>

              <Input
                id="profile-name"
                autoComplete="name"
                placeholder="Enter your name"
                maxLength={100}
                {...profileForm.register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Name cannot be empty",
                  maxLength: {
                    value: 100,
                    message: "Name must be at most 100 characters",
                  },
                })}
              />

              {profileForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {profileForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email address</Label>
              <Input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email changes are managed separately.
              </p>
            </div>

            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting
                ? "Saving..."
                : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password settings */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Choose a strong password you do not use elsewhere.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>

              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword", {
                  required: "Current password is required",
                })}
              />

              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>

              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: (value) =>
                    value !== passwordForm.getValues("currentPassword") ||
                    "New password must differ from current password",
                })}
              />

              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>

              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordForm.getValues("newPassword") ||
                    "Passwords do not match",
                })}
              />

              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting
                ? "Updating..."
                : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Account deletion */}
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Permanently delete your account.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Delete account</p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={(open) => {
              setDeleteDialogOpen(open);

              if (!open) {
                deleteForm.reset();
              }
            }}
          >
            <AlertDialogTrigger>
              <span className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90">
                Delete account
              </span>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

                <AlertDialogDescription>
                  This permanently deletes your account. Enter your current
                  password to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <form
                onSubmit={deleteForm.handleSubmit(onDeleteSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="delete-password">Current password</Label>

                  <Input
                    id="delete-password"
                    type="password"
                    autoComplete="current-password"
                    {...deleteForm.register("password", {
                      required: "Enter your password to continue",
                    })}
                  />

                  {deleteForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {deleteForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={deleteForm.formState.isSubmitting}
                  >
                    {deleteForm.formState.isSubmitting
                      ? "Deleting..."
                      : "Delete permanently"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </main>
  );
}
