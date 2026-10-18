import {
  FormDrawer,
  type Organization,
  type OrganizationInputs,
} from "@/components/FormDrawer";
import { Loading } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Ellipsis, PencilIcon, Plus, ShareIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

const apiURL = import.meta.env.VITE_API_URL;

type OrganizationMembership = {
  organization: Organization;
};

export const Organizations = () => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const { isPending, error, data } = useQuery<OrganizationMembership[]>({
    queryKey: ["organizationsData"],
    queryFn: async () => {
      const response = await axios.get(`${apiURL}/api/v1/organizations`, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: OrganizationInputs) => {
      const response = await axios.post(
        `${apiURL}/api/v1/organizations`,
        values,
        { withCredentials: true },
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organizationsData"],
      });

      toast.add({
        type: "success",
        description: "Organization created successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: OrganizationInputs;
    }) => {
      const response = await axios.patch(
        `${apiURL}/api/v1/organizations/${id}`,
        values,
        { withCredentials: true },
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["organizationsData"],
      });

      toast.add({
        type: "success",
        description: "Organization updated successfully.",
      });
    },
  });

  const handleCreate = () => {
    setSelectedOrganization(null);
    setMode("create");
    setOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setMode("edit");
    setOpen(true);
  };

  const handleOrganizationSubmit = async (values: OrganizationInputs) => {
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else {
        if (!selectedOrganization) {
          throw new Error("No organization selected for editing.");
        }

        await updateMutation.mutateAsync({
          id: selectedOrganization.id,
          values,
        });
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Request failed."
        : error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.add({
        type: "error",
        description: message,
      });

      // Keep the drawer open so the user can retry.
      throw error;
    }
  };

  useEffect(() => console.log(data), [data]);

  if (isPending) {
    return <Loading />;
  }
  if (error) {
    console.error(error);
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Failed to load organizations.</p>
      </div>
    );
  }

  const organizations = data.map((item) => item.organization);

  return (
    <>
      <main className="w-full min-h-screen flex flex-col">
        <div className="flex justify-end items-center mt-4 px-18">
          <Button className="cursor-pointer" onClick={handleCreate}>
            <Plus size={16} />
            Create New Organization
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {organizations.map((organization: Organization) => (
            <Card
              key={organization.id}
              className="relative mx-auto w-full max-w-sm pt-0"
            >
              <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
              <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
              />
              <CardHeader>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Badge
                          variant="secondary"
                          className="flex h-8 w-12 items-center justify-center cursor-pointer p-0 hover:bg-gray-300"
                        >
                          <Ellipsis className="h-5 w-5 shrink-0" size={8} />
                        </Badge>
                      }
                    />
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleEdit(organization)}
                        >
                          <PencilIcon />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShareIcon />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive">
                          <TrashIcon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>
                  {/* 70 characters */}
                  {organization.description.length > 70
                    ? `${organization.description.slice(0, 70)}...`
                    : organization.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full cursor-pointer">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <FormDrawer
        open={open}
        setOpen={setOpen}
        mode={mode}
        organization={selectedOrganization}
        onSubmit={handleOrganizationSubmit}
      />
    </>
  );
};
