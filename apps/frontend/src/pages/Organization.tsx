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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Ellipsis, PencilIcon, ShareIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";

const apiURL = import.meta.env.VITE_API_URL;

export const Organizations = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["organizationsData"],
    queryFn: async () => {
      const response = await axios.get(`${apiURL}/api/v1/organizations`, {
        withCredentials: true,
      });

      return await response.data;
    },
  });

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

  return (
    <div className="flex flex-wrap gap-6 justify-between w-full max-h-screen p-16">
      {[...Array(70)].map((_, idx) => (
        <Card key={idx} className="relative mx-auto w-full max-w-sm pt-0">
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
                    <DropdownMenuItem>
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
            <CardTitle>{data[0].organization.name}</CardTitle>
            <CardDescription>
              {/* 70 characters */}
              {data[0].organization.description.length > 70
                ? `${data[0].organization.description.slice(0, 70)}...`
                : data[0].organization.description}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full cursor-pointer">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
